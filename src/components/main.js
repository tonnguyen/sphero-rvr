import { useState, useEffect, useCallback, useRef } from 'react';
import Gamepad from './gamepad';
import Joystick from './joystick';
import CogWheelIcon from '../images/cogwheel.svg';
import Battery from './battery';
import Range from './range';
import { RadialGauge } from 'react-canvas-gauges';
import { SpheroRvrToy } from 'sdk-v4-convenience-raspberry-pi-client-js';
import throttle from '../utils/throttle';

/**
 * Normalizes a value to be on a new scale defined by newMin and newMax.
 * Example: normalize(10, 5, 15, 0, 1) -> 0.5
 */
function normalize(value, min, max, newMin, newMax) {
	return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
}

const throttledDriveWithHeading = throttle((rvrToy, speed, theta, backward) => {
  // The driveWithHeading command takes in a speed you'd like to drive at and a direction 
  // (angle between 0 and 360) that you'd like to drive in. There is also an optional 
  // third parameter that allows you to drive the RVR in reverse, with a value of "1".
  !backward ? rvrToy.driveWithHeading(speed, theta) : rvrToy.driveWithHeading(speed, theta, 1);
}, 100);

function Main(props) {
  const [leftAxis, setLeftAxis] = useState({ x: 0, y: 0 });
  const [rightAxis, setRightAxis] = useState({ x: 0, y: 0 });
  const [maxSpeed, setMaxSpeed] = useState(100);
  const [velocity, setVelocity] = useState(0);
  const [battery, setBattery] = useState(0);
  const [rvrToy, setRvrToy] = useState(null);
  const lastCheckMs = useRef(Date.now());
  const lastHeading = useRef(0);
  const lastLeftAxisY = useRef(0);
  const lastRightAxisX = useRef(0);
  useEffect(() => {
    const connect = async() => {
      try {
        const car = new SpheroRvrToy(props.settings.piAddress, '2010');
        car.wake();
        const data = await car.getBatteryPercentage(1)
        const obj = data ? JSON.parse(data) : null;
        setBattery(obj?.percentage ?? 0);
        setRvrToy(car);
        car.getDriveControl().resetHeading();
        const sensorControl = car.getSensorControl();
        sensorControl.enableSensor(sensorControl.velocity, data => {
          const velocity = Math.sqrt((data.X ** 2) + (data.Y ** 2));
          setVelocity(velocity);
        });
        if (sensorControl.isStreaming) {
          sensorControl.clearSensorStreaming();
        }
        sensorControl.startSensorStreaming(100);
        return () => {
          sensorControl.clearSensorStreaming();
        }
      } catch(e) {
        setRvrToy(null);
        alert(`Unable to connect to RVR: ${e.message}`);
      }
    }
    connect();
  }, [props.settings.piAddress]);

  // drive the car whenever leftAxis or rightAxis changed
  useEffect(() => {
    if (!rvrToy) {
      return;
    }
    if (lastLeftAxisY.current === 0 && lastRightAxisX.current === 0 && leftAxis.y === 0 && rightAxis.x === 0) {
      return;
    }
    lastLeftAxisY.current = leftAxis.y;
    lastRightAxisX.current = rightAxis.x;

    const speed = normalize(Math.abs(leftAxis.y), 0, 1, 0, maxSpeed);
    const backward = leftAxis.y > 0;
    const right = rightAxis.x > 0;
    let degree = normalize(Math.abs(rightAxis.x), 0, 1, 0, 180);
    if (degree === 0 && lastHeading.current !== 0) {
      rvrToy.getDriveControl().resetHeading();
    } else {
      const deltaMs = Date.now() - lastCheckMs.current;
      lastCheckMs.current = Date.now();
      if (right) {
        degree = !backward ? degree : -degree;
      } else {
        degree = !backward ? -degree : degree;
      }
      degree = lastHeading.current + deltaMs * 0.15 * (degree / 180); // YAW rate, 1 --second for 180 degrees
      degree = Math.round(degree % 360);
      if (degree < 0) {
        degree += 360;
      }
    }
    
    lastHeading.current = degree;
    throttledDriveWithHeading(rvrToy, speed, lastHeading.current, backward);
  }, [rvrToy, leftAxis, rightAxis, maxSpeed]);

  const onLeftJoystickChange = useCallback(({ _, y }) => setLeftAxis({ x: 0, y }), [setLeftAxis]);
  const onRightJoystickChange = useCallback(({ x, _ }) => setRightAxis({ x, y: 0 }), [setRightAxis]);
  const onLeftYChange = useCallback((y) => setLeftAxis({ x: 0, y }), [setLeftAxis]);
  const onRightXChange = useCallback((x) => setRightAxis({ x, y: 0 }), [setRightAxis]);
  const onLeftTriggerPressed = useCallback((value) => setLeftAxis({ x: 0, y: value }), [setLeftAxis]);
  const onRightTriggerPressed = useCallback((value) => setLeftAxis({ x: 0, y: -value }), [setLeftAxis]);
  const onMaxSpeedChanged = useCallback((value) => {
    setMaxSpeed(value);
    rvrToy && rvrToy.getLedControl().setAllLedsRgb(150, 100, value);
  }, [rvrToy, setMaxSpeed]);
  const onLeftBumperPressed = useCallback(() => onMaxSpeedChanged(Math.max(maxSpeed - 10, 60)), [maxSpeed, onMaxSpeedChanged]);
  const onRightBumperPressed = useCallback(() => onMaxSpeedChanged(Math.min(maxSpeed + 10, 255)), [maxSpeed, onMaxSpeedChanged]);

  return (
    <div className="Main">
        {props.settings.camera && <object data={`http://${props.settings.piAddress}:3000/stream.mjpg`} type="image/jpg" style={{ width: '100%' }}>
          <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" alt="Live camera" style={{ width: '100%' }} />
        </object>}
        <Battery level={battery} />
        <Range className="SppedRange" value={maxSpeed} onChange={onMaxSpeedChanged} />
        <img className="Settings" src={CogWheelIcon} onClick={props.showSettings} alt="Settings" />
        <div className='Info'>
          {/* <div>Left: {leftAxis.y.toFixed(2)}</div>
          <div>Right: {rightAxis.x.toFixed(2)}</div>
          <div>{props.settings.gamepadId}</div> */}
          {props.settings.gauge && <div>
            <RadialGauge units='cm/s' width={300} value={velocity} minValue={0} startAngle={90} ticksAngle={180} maxValue={180}
              majorTicks={["0", "20", "40", "60", "80", "100", "120", "140", "160", "180"]}
              highlights={[
                {
                    "from": 140,
                    "to": 180,
                    "color": "rgba(200, 50, 50, .75)"
                }
              ]}
              minorTicks={2} borders={false} colorPlate={'#000'} animationDuration={500}
              animationRule={'linear'} colorNumbers={'#eee'} colorBorderOuter={'#000'} colorBorderMiddle={'#000'}
            ></RadialGauge>
          </div>}
        </div>
        {props.settings.joysticks && <>
          <Joystick left={true} onValue={onLeftJoystickChange} defaultPosition={leftAxis} />
          <Joystick left={false} onValue={onRightJoystickChange} defaultPosition={rightAxis} />
        </>}
        <Gamepad id={props.settings.gamepadId} onLeftYChange={onLeftYChange} 
                                      onRightXChange={onRightXChange}
                                      onLeftBumperPressed={onLeftBumperPressed}
                                      onRightBumperPressed={onRightBumperPressed}
                                      onLeftTriggerPressed={onLeftTriggerPressed} 
                                      onRightTriggerPressed={onRightTriggerPressed} 
        />
    </div>
  );
}

export default Main;
