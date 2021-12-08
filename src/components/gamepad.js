import { useCallback, useEffect, useState } from 'react';
import useAnimationFrame from '../hooks/useAnimationFrame';

const Gamepad = ({ onLeftYChange, onRightXChange }) => {
    const [gamepad, setGamepad] = useState(null);
    const [leftY, setLeftY] = useState(0);
    const [rightX, setRightX] = useState(0);
    const gamepadConnected = useCallback((e) => {
        const gp = e.gamepad;
        if (isGamepad(gp)) {
            setGamepad(gp);
        }
    }, [setGamepad]);

    const gamepadDisconnected = useCallback((e) => {
        if (gamepad && e.gamepad && gamepad.id === e.gamepad.id) {
            setGamepad(null);
        }
    }, [gamepad, setGamepad]);

    useEffect(() => {
        window.addEventListener('gamepadconnected', gamepadConnected);
        window.addEventListener('gamepaddisconnected', gamepadDisconnected);
        return () => {
            window.removeEventListener('gamepadconnected', gamepadConnected);
            window.removeEventListener('gamepaddisconnected', gamepadDisconnected);
        }
    }, [setGamepad, gamepadConnected, gamepadDisconnected]);

    useAnimationFrame(() => {
        const gamepads = navigator.getGamepads();
        let currentGp = null;
        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            if (gp && gp.id === gamepad?.id) {
                currentGp = gp;
                break;
            }
        }
        if (!currentGp) {
            return;
        }
        /**
         * Left stick X: 0
         * Left stick Y: 1
         * Right stick X: 2
         * Right stick Y: 3
         */
        const lY = setDeadzone(currentGp.axes[1]);
        const rX = setDeadzone(currentGp.axes[2]);
        if (leftY !== lY) {
            setLeftY(lY);
            onLeftYChange(lY);
        }
        if (rightX !== rX) {
            setRightX(rX);
            onRightXChange(rX);
        }
    });

    return <div>{`${gamepad?.id}`}</div>
}

function isGamepad(gp) {
    return gp && gp.connected && gp.id.toLowerCase().includes('controller');
}

function setDeadzone(v) {
    // Anything smaller than this is assumed to be 0,0
    const DEADZONE = 0.2;

    if (Math.abs(v) < DEADZONE) {
        // In the dead zone, set to 0
        v = 0;

    } else {
        // We're outside the dead zone, but we'd like to smooth
        // this value out so it still runs nicely between 0..1.
        // That is, we don't want it to jump suddenly from 0 to
        // DEADZONE.

        // Remap v from
        //    DEADZONE..1 to 0..(1-DEADZONE)
        // or from
        //    -1..-DEADZONE to -(1-DEADZONE)..0

        v = v - Math.sign(v) * DEADZONE;

        // Remap v from
        //    0..(1-DEADZONE) to 0..1
        // or from
        //    -(1-DEADZONE)..0 to -1..0

        v /= (1.0 - DEADZONE);

    }
    return v;
}

export default Gamepad;