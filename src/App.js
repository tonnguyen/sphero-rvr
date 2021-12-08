import { useState } from 'react';
import './App.css';
import Main from './components/main';
import Settings from './components/settings';

function App() {
  const [screen, setScreen] = useState('main');
  const [gamepadId, setGamepadId] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        {screen === 'main' && <Main gamepadId={gamepadId} showSettings={() => setScreen('settings')} />}
        {screen === 'settings' && <Settings gamepadId={gamepadId} close={(settings) => {
          setGamepadId(settings.gamepadId);
          setScreen('main');
        }} />}
      </header>
    </div>
  );
}

export default App;
