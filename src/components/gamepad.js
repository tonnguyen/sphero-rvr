import { useCallback, useEffect, useState } from 'react';
import useAnimationFrame from '../hooks/useAnimationFrame';

const Gamepad = ({ id, onLeftYChange, onRightXChange, onLeftBumperPressed, onRightBumperPressed }) => {
    const [gamepadId, setGamepadId] = useState(id);
    const [leftY, setLeftY] = useState(0);
    const [rightX, setRightX] = useState(0);
    const gamepadConnected = useCallback((e) => {
        // if no gamepad was configured, select the first one
        if (gamepadId) {
            return;
        }
        const gp = e.gamepad;
        if (isGamepad(gp, id)) {
            setGamepadId(gp.id);
        }
    }, [setGamepadId, gamepadId, id]);

    const gamepadDisconnected = useCallback((e) => {
        if (e.gamepad && gamepadId === e.gamepad.id) {
            // if the gamepad is disconnected, try the first one
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                const gp = gamepads[i];
                if (gp && gp.id === gamepadId?.id) {
                    setGamepadId(gp.id);
                    return;
                }
            }
            setGamepadId(null);
        }
    }, [gamepadId, setGamepadId]);

    useEffect(() => {
        window.addEventListener('gamepadconnected', gamepadConnected);
        window.addEventListener('gamepaddisconnected', gamepadDisconnected);
        return () => {
            window.removeEventListener('gamepadconnected', gamepadConnected);
            window.removeEventListener('gamepaddisconnected', gamepadDisconnected);
        }
    }, [setGamepadId, gamepadConnected, gamepadDisconnected]);

    useAnimationFrame(() => {
        const gamepads = navigator.getGamepads();
        let currentGp = null;
        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            if (gp && gp.id === gamepadId) {
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

        /**
         * Left bumper: 4
         * Right bumper: 5
         */
        if (currentGp.buttons[4].pressed && currentGp.buttons[4].value === 1.0) {
            onLeftBumperPressed();
        }
        if (currentGp.buttons[5].pressed && currentGp.buttons[5].value === 1.0) {
            onRightBumperPressed();
        }
    });

    return <div></div>
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