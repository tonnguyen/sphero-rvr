import { useState } from 'react';
import Gamepad from './gamepad';
import Joystick from './joystick';
import CogWheelIcon from '../images/cogwheel.svg';

function Main(props) {
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [leftY, setLeftY] = useState(0);
  const [rightX, setRightX] = useState(0);
  return (
    <>
        <img className="Settings" src={CogWheelIcon} onClick={props.showSettings} alt="Settings" />
        <div>Joystick 1: {JSON.stringify(value1)}</div>
        <div>Joystick 2: {JSON.stringify(value2)}</div>
        <div>Left: {leftY.toFixed(2)}</div>
        <div>Right: {rightX.toFixed(2)}</div>
        <Joystick left={true} onValue={setValue1} />
        <Joystick left={false} onValue={setValue2} />
        <Gamepad id={props.gamepadId} onLeftYChange={setLeftY} onRightXChange={setRightX} />
    </>
  );
}

export default Main;
