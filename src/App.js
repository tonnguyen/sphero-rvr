import { useState } from 'react';
import './App.css';
import Main from './components/main';
import Settings from './components/settings';

function App() {
  const [screen, setScreen] = useState('main');
  const [settings, setSettings] = useState({ piAddress: 'raspberrypi.local:3000', camera: true });
  return (
    <div className="App">
        {screen === 'main' && <Main gamepadId={settings.gamepadId} camera={settings.camera}
                              piAddress={settings.piAddress} showSettings={() => setScreen('settings')} />}
        {screen === 'settings' && <Settings settings={settings} close={(settings) => {
          setSettings(settings);
          setScreen('main');
        }} />}
    </div>
  );
}

export default App;
