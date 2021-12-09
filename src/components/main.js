import { useState } from 'react';
import Gamepad from './gamepad';
import Joystick from './joystick';
import CogWheelIcon from '../images/cogwheel.svg';

function Main(props) {
  const [value1, setValue1] = useState({ x: 0, y: 0 });
  const [value2, setValue2] = useState({ x: 0, y: 0 });
  const [leftAxis, setLeftAxis] = useState({ x: 0, y: 0 });
  const [rightAxis, setRightAxis] = useState({ x: 0, y: 0 });
  return (
    <div className="LiveCamera" style={{ backgroundImage: `url(http://192.168.0.73:3000/stream.mjpg)` }}>
        {/* <img src={'http://raspberrypi.local:3000/stream.mjpg'} alt="Live camera" /> */}
        <img className="Settings" src={CogWheelIcon} onClick={props.showSettings} alt="Settings" />
        <div>Joystick 1: {value1.y.toFixed(2)}</div>
        <div>Joystick 2: {value2.x.toFixed(2)}</div>
        <div>Left: {leftAxis.y.toFixed(2)}</div>
        <div>Right: {rightAxis.x.toFixed(2)}</div>
        <Joystick left={true} onValue={setValue1} defaultPosition={leftAxis} />
        <Joystick left={false} onValue={setValue2} defaultPosition={rightAxis} />
        <Gamepad id={props.gamepadId} onLeftYChange={(leftY) => setLeftAxis({ x: 0, y: leftY })} 
                                      onRightXChange={(rightX) => setRightAxis({ x: rightX, y: 0 })} />
    </div>
  );
}

export default Main;
