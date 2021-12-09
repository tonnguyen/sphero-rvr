import { useState } from 'react';
import './App.css';
import Main from './components/main';
import Settings from './components/settings';

function App() {
  const [screen, setScreen] = useState('main');
  const [gamepadId, setGamepadId] = useState('');
  return (
    <div className="App" style={{ backgroundImage: `url(http://192.168.0.73:3000/stream.mjpg)` }}>
        {screen === 'main' && <Main gamepadId={gamepadId} showSettings={() => setScreen('settings')} />}
        {screen === 'settings' && <Settings gamepadId={gamepadId} close={(settings) => {
          setGamepadId(settings.gamepadId);
          setScreen('main');
        }} />}
    </div>
  );
}

export default App;
