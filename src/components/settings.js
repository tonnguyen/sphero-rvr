import { useState, useCallback, useEffect } from 'react';

function Settings(props) {
    const [gamepadId, setGamepadId] = useState(props.gamepadId);
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
        <>
            <div>
                <select value={gamepadId} onChange={(e) => setGamepadId(e.target.value)}>
                    {ids.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
            </div>
            <div><button onClick={() => props.close({ gamepadId })}>OK</button></div>
        </>
    );
}

export default Settings;
