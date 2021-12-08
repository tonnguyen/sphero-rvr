import { useState } from 'react';
import './App.css';
import Gamepad from './components/gamepad';
import Joystick from './components/joystick';

function App() {
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [leftY, setLeftY] = useState(0);
  const [rightX, setRightX] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <div>Joystick 1: {JSON.stringify(value1)}</div>
        <div>Joystick 2: {JSON.stringify(value2)}</div>
        <div>Left: {leftY.toFixed(2)}</div>
        <div>Right: {rightX.toFixed(2)}</div>
        <Joystick left={true} onValue={setValue1} />
        <Joystick left={false} onValue={setValue2} />
        <Gamepad onLeftYChange={setLeftY} onRightXChange={setRightX} />
      </header>
    </div>
  );
}

export default App;
