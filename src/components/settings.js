import { useState, useCallback, useEffect } from 'react';

function Settings(props) {
    const [gamepadId, setGamepadId] = useState(props.settings.gamepadId);
    const [piAddress, setPiAddress] = useState(props.settings.piAddress);
    const [camera, setCamera] = useState(props.settings.camera);
    const [joysticks, setJoysticks] = useState(props.settings.joysticks);
    const [gauge, setGauge] = useState(props.settings.gauge);
    const [ids, setIds] = useState([]);

    const scan = useCallback(() => {
        const gamepads = navigator.getGamepads();
        let ids = [];
        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            gp && ids.push(gp.id);
        }
        setIds(ids);
    }, [setIds]);

    useEffect(() => {
        window.addEventListener('gamepadconnected', scan);
        window.addEventListener('gamepaddisconnected', scan);
        return () => {
            window.removeEventListener('gamepadconnected', scan);
            window.removeEventListener('gamepaddisconnected', scan);
        }
    }, [scan]);

    useEffect(() => scan(), [scan]);

    return (
        <form onSubmit={(e) => {
            submit(props, ids, gamepadId, piAddress, camera, joysticks, gauge);
            e.preventDefault();
        }}>
            <div>
                <label>Controller:</label>
                <select value={gamepadId} onChange={(e) => setGamepadId(e.target.value)}>
                    {ids.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
            </div>
            <div>
                <label>Pi address:</label>
                <input type="text" value={piAddress} onChange={(e) => setPiAddress(e.target.value)} ></input>
            </div>
            <div>
                <input type="checkbox" id="camera" defaultChecked={camera} onChange={(e) => setCamera(!camera)} ></input>
                <label htmlFor="camera">Camera</label>
            </div>
            <div>
                <input type="checkbox" id="joysticks" defaultChecked={joysticks} onChange={(e) => setJoysticks(!joysticks)} ></input>
                <label htmlFor="joysticks">Joysticks</label>
            </div>
            <div>
                <input type="checkbox" id="gauge" defaultChecked={gauge} onChange={(e) => setGauge(!gauge)} ></input>
                <label htmlFor="gauge">Speedoneter</label>
            </div>
            <div>
            <input type="submit" value="Save" className='Button' /></div>
        </form>
    );
}

const submit = (props, ids, gamepadId, piAddress, camera, joysticks, gauge) => {
    props.close({ 
        gamepadId: gamepadId ?? (ids.length > 0 ? ids[0] : ''),
        piAddress,
        camera,
        joysticks,
        gauge,
    });
}

export default Settings;
