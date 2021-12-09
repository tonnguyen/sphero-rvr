import { useState } from 'react';
import './App.css';
import Main from './components/main';
import Settings from './components/settings';

function App() {
  const [screen, setScreen] = useState('main');
  const [settings, setSettings] = useState({ piAddress: 'raspberrypi.local:3000', camera: true, joysticks: true, gauge: true });
  return (
    <div className="App">
        {screen === 'main' && <Main settings={settings} showSettings={() => setScreen('settings')} />}
        {screen === 'settings' && <Settings settings={settings} close={(settings) => {
          setSettings(settings);
          setScreen('main');
        }} />}
    </div>
  );
}

export default App;
