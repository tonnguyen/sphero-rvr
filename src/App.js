import { useCallback, useState } from 'react';
import './App.css';
import Main from './components/main';
import Settings from './components/settings';

function App() {
  const [screen, setScreen] = useState('main');
  const [settings, setSettings] = useState({ piAddress: 'raspberrypi.local', camera: true, joysticks: true, gauge: true, fullscreen: false });
  const showSettings = useCallback(() => setScreen('settings'), [setScreen]);
  const closeSettings = useCallback(settings => {
    setSettings(settings);
    setScreen('main');
  }, [setSettings, setScreen]);
  return (
    <div className="App">
        {screen === 'main' && <Main settings={settings} showSettings={showSettings} />}
        {screen === 'settings' && <Settings settings={settings} close={closeSettings} />}
    </div>
  );
}

export default App;
