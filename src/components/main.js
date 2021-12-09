import { useState } from 'react';
import Gamepad from './gamepad';
import Joystick from './joystick';
import CogWheelIcon from '../images/cogwheel.svg';
import Battery from './battery';
import Range from './range';
import { RadialGauge } from 'react-canvas-gauges';

function Main(props) {
  const [value1, setValue1] = useState({ x: 0, y: 0 });
  const [value2, setValue2] = useState({ x: 0, y: 0 });
  const [leftAxis, setLeftAxis] = useState({ x: 0, y: 0 });
  const [rightAxis, setRightAxis] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(120);
  return (
    <div className="Main">
        {props.settings.camera && <object data={`http://${props.settings.piAddress}/stream.mjpg`} type="image/jpg" style={{ width: '100%' }}>
          <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" alt="Live camera" style={{ width: '100%' }} />
        </object>}
        <Battery level={70} />
        <Range className="SppedRange" value={speed} onChange={setSpeed} />
        <img className="Settings" src={CogWheelIcon} onClick={props.showSettings} alt="Settings" />
        <div className='Info'>
          <div>Joystick 1: {value1.y.toFixed(2)}</div>
          <div>Joystick 2: {value2.x.toFixed(2)}</div>
          <div>Left: {leftAxis.y.toFixed(2)}</div>
          <div>Right: {rightAxis.x.toFixed(2)}</div>
          <div>{props.settings.gamepadId}</div>
          {props.settings.gauge && <div>
            <RadialGauge
              units='cm/s'
              width={300}
              value={speed}
              minValue={0}
              startAngle={90}
              ticksAngle={180}
              maxValue={180}
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
              minorTicks={2}
              highlights={[
                {
                    "from": 140,
                    "to": 180,
                    "color": "rgba(200, 50, 50, .75)"
                }
              ]}
              borders={false}
              colorPlate={'#000'}
              animationDuration={500}
              animationRule={'linear'}
              colorNumbers={'#eee'}
              colorBorderOuter={'#000'}
              colorBorderMiddle={'#000'}
            ></RadialGauge>
          </div>}
        </div>
        {props.settings.joysticks && <>
          <Joystick left={true} onValue={setValue1} defaultPosition={leftAxis} />
          <Joystick left={false} onValue={setValue2} defaultPosition={rightAxis} />
        </>}
        <Gamepad id={props.settings.gamepadId} onLeftYChange={(leftY) => setLeftAxis({ x: 0, y: leftY })} 
                                      onRightXChange={(rightX) => setRightAxis({ x: rightX, y: 0 })}
                                      onLeftBumperPressed={() => setSpeed(Math.max(speed - 1, 1))}
                                      onRightBumperPressed={() => setSpeed(Math.min(speed + 1, 255))}
                                      onLeftTriggerPressed={(value) => setLeftAxis({ x: 0, y: value })} 
                                      onRightTriggerPressed={(value) => setLeftAxis({ x: 0, y: -value })} 
        />
    </div>
  );
}

export default Main;
