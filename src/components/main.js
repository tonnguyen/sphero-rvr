import { useState, useEffect, useCallback } from 'react';
import Gamepad from './gamepad';
import Joystick from './joystick';
import CogWheelIcon from '../images/cogwheel.svg';
import Battery from './battery';
import Range from './range';
import { RadialGauge } from 'react-canvas-gauges';
import { SpheroRvrToy } from 'sdk-v4-convenience-raspberry-pi-client-js';

function Main(props) {
  const [value1, setValue1] = useState({ x: 0, y: 0 });
  const [value2, setValue2] = useState({ x: 0, y: 0 });
  const [leftAxis, setLeftAxis] = useState({ x: 0, y: 0 });
  const [rightAxis, setRightAxis] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(120);
  const [battery, setBattery] = useState(0);
  const [rvrToy, setRvrToy] = useState(null);
  useEffect(() => {
    const connect = async() => {
      try {
        const car = new SpheroRvrToy(props.settings.piAddress, '2010');
        const data = await car.getBatteryPercentage(1)
        const obj = data ? JSON.parse(data) : null;
        setBattery(obj?.percentage ?? 0);
        setRvrToy(car);
      } catch {
        setRvrToy(null);
      }
    }
    connect();
  }, [props.settings.piAddress]);

  const onLeftYChange = useCallback((leftY) => setLeftAxis({ x: 0, y: leftY }), [setLeftAxis]);
  const onRightXChange = useCallback((rightX) => setRightAxis({ x: rightX, y: 0 }), [setRightAxis]);
  const onLeftBumperPressed = useCallback(() => setSpeed(Math.max(speed - 1, 1)), [speed, setSpeed]);
  const onRightBumperPressed = useCallback(() => setSpeed(Math.min(speed + 1, 255)), [speed, setSpeed]);
  const onLeftTriggerPressed = useCallback((value) => setLeftAxis({ x: 0, y: value }), [setLeftAxis]);
  const onRightTriggerPressed = useCallback((value) => setLeftAxis({ x: 0, y: -value }), [setLeftAxis]);

  return (
    <div className="Main">
        {props.settings.camera && <object data={`http://${props.settings.piAddress}:3000/stream.mjpg`} type="image/jpg" style={{ width: '100%' }}>
          <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" alt="Live camera" style={{ width: '100%' }} />
        </object>}
        <Battery level={battery} />
        <Range className="SppedRange" value={speed} onChange={setSpeed} />
        <img className="Settings" src={CogWheelIcon} onClick={props.showSettings} alt="Settings" />
        <div className='Info'>
          <div>Joystick 1: {value1.y.toFixed(2)}</div>
          <div>Joystick 2: {value2.x.toFixed(2)}</div>
          <div>Left: {leftAxis.y.toFixed(2)}</div>
          <div>Right: {rightAxis.x.toFixed(2)}</div>
          <div>{props.settings.gamepadId}</div>
          {props.settings.gauge && <div>
            <RadialGauge units='cm/s' width={300} value={speed} minValue={0} startAngle={90} ticksAngle={180} maxValue={180}
              majorTicks={["0",
              "20",
              "40",
              "60",
              "80",
              "100",
              "120",
              "140",
              "160",
              "180"]}
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
          <Joystick left={true} onValue={setValue1} defaultPosition={leftAxis} />
          <Joystick left={false} onValue={setValue2} defaultPosition={rightAxis} />
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
