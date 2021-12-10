import { useCallback, useEffect, useRef, useState } from 'react';
import useAnimationFrame from '../hooks/useAnimationFrame';

const Gamepad = ({ id, onLeftYChange, onRightXChange, onLeftBumperPressed, onRightBumperPressed,
                    onLeftTriggerPressed, onRightTriggerPressed }) => {
    const [gamepadId, setGamepadId] = useState(id);
    const leftY = useRef(0);
    const CONTROLLER = CONTROLLERS.XBOX;
    const gamepadConnected = useCallback((e) => {
        // if no gamepad was configured, select the first one
        if (gamepadId) {
            return;
        }
        const gp = e.gamepad;
        if (isGamepad(gp, id)) {
            setGamepadId(gp.id);
        }
    }, [gamepadId, setGamepadId, id]);

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
    }, [gamepadConnected, gamepadDisconnected]);

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
        
        let lY = setDeadzone(currentGp.axes[CONTROLLER.LEFT_AXIS_Y]);
        const rX = setDeadzone(currentGp.axes[CONTROLLER.RIGHT_AXIS_X]);
        if (lY !== 0) {
            if (leftY.current !== lY) {
                leftY.current = lY;
                onLeftYChange(lY);
            }
        } else {
            lY = setDeadzone(currentGp.buttons[CONTROLLER.RIGHT_TRIGGER].value);
            if (lY !== 0) {
                if (leftY.current !== lY) {
                    leftY.current = lY;
                    onRightTriggerPressed(lY);
                }
            } else {
                lY = setDeadzone(currentGp.buttons[CONTROLLER.LEFT_TRIGGER].value);
                if (leftY.current !== lY) {
                    leftY.current = lY;
                    onLeftTriggerPressed(lY);
                }
            }
        }

        onRightXChange(rX);
        
        if (currentGp.buttons[CONTROLLER.LEFT_BUMPER].pressed && currentGp.buttons[CONTROLLER.LEFT_BUMPER].value === 1.0) {
            onLeftBumperPressed();
        }
        if (currentGp.buttons[CONTROLLER.RIGHT_BUMPER].pressed && currentGp.buttons[CONTROLLER.RIGHT_BUMPER].value === 1.0) {
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
    const DEADZONE = 0.1;

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

const XBOX_CONTROLLER = {
    A_BUTTON: 0,
    B_BUTTON: 1,
    X_BUTTON: 2,
    Y_BUTTON: 3,
    LEFT_BUMPER: 4,
    RIGHT_BUMPER: 5,
    LEFT_TRIGGER: 6,
    RIGHT_TRIGGER: 7,
    VIEW_BUTTON: 8,
    MENU_BUTTON: 9,
    UP_DPAD: 12,
    DOWN_DPAD: 13,
    LEFT_DPAD: 14,
    RIGHT_DPAD: 15,
    XBOX_BUTTON: 16,
    LEFT_AXIS_X: 0,
    LEFT_AXIS_Y: 1,
    RIGHT_AXIS_X: 2,
    RIGHT_AXIS_Y: 3,
}

const CONTROLLERS = {
    XBOX: XBOX_CONTROLLER,
}

export default Gamepad;