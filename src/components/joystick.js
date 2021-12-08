import { useCallback, useEffect, useRef, useState } from 'react';
import useAnimationFrame from '../hooks/useAnimationFrame';
import joystickBase from '../images/joystick-base.png';
import joystickRed from '../images/joystick-red.png';

function Joystick({ maxDistance, deadzone, left, onValue }) {
    const stick = useRef(null);
    const [dragStart, setDragStart] = useState(null);
    const [active, setActive] = useState(false);
    const [value, setValue] = useState({ x: 0, y: 0 });
    const [touchId, setTouchId] = useState(null);

    const handleDown = (event) => {
        setActive(true);

        // all drag movements are instantaneous
        stick.current.style.transition = '0s';

        // touch event fired before mouse event; prevent redundant mouse event from firing
        event.preventDefault();

        if (event.changedTouches)
            setDragStart({ x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY });
        else
            setDragStart({ x: event.clientX, y: event.clientY });

        // if this is a touch event, keep track of which one
        if (event.changedTouches)
            setTouchId(event.changedTouches[0].identifier);
    }

    const handleMove = useCallback(event => {
        if (!active ) return;

        // if this is a touch event, make sure it is the right one
        // also handle multiple simultaneous touchmove events
        let touchmoveId = null;
        if (event.changedTouches)
        {
            for (let i = 0; i < event.changedTouches.length; i++)
            {
                if (touchId === event.changedTouches[i].identifier)
                {
                    touchmoveId = i;
                    event.clientX = event.changedTouches[i].clientX;
                    event.clientY = event.changedTouches[i].clientY;
                }
            }

            if (touchmoveId == null) return;
        }

        const xDiff = event.clientX - dragStart.x;
        const yDiff = event.clientY - dragStart.y;
        const angle = Math.atan2(yDiff, xDiff);
        const distance = Math.min(maxDistance, Math.hypot(xDiff, yDiff));
        const xPosition = distance * Math.cos(angle);
        const yPosition = distance * Math.sin(angle);

        // move stick image to new position
        stick.current.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0px)`;

        // deadzone adjustment
        const distance2 = (distance < deadzone) ? 0 : maxDistance / (maxDistance - deadzone) * (distance - deadzone);
        const xPosition2 = distance2 * Math.cos(angle);
        const yPosition2 = distance2 * Math.sin(angle);
        const xPercent = parseFloat((xPosition2 / maxDistance).toFixed(4));
        const yPercent = parseFloat((yPosition2 / maxDistance).toFixed(4));
        
        setValue({ x: xPercent, y: yPercent });
    }, [active, deadzone, dragStart, maxDistance, touchId]);

    const handleUp = useCallback(event => {
        if (!active ) return;

        // if this is a touch event, make sure it is the right one
        if (event.changedTouches && touchId !== event.changedTouches[0].identifier) return;

        // transition the joystick position back to center
        stick.current.style.transition = '.2s';
        stick.current.style.transform = `translate3d(0px, 0px, 0px)`;

        // reset everything
        setValue({ x: 0, y: 0 });
        setTouchId(null);
        setActive(false);
    }, [active, touchId]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMove, {passive: false});
		document.addEventListener('touchmove', handleMove, {passive: false});
		document.addEventListener('mouseup', handleUp);
		document.addEventListener('touchend', handleUp);
        const stickRef = stick.current;
        stickRef.addEventListener('touchstart', handleDown, {passive: false});
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup', handleUp);
            document.removeEventListener('touchend', handleUp);
            stickRef.removeEventListener('touchstart', handleDown);
        }
    }, [handleMove, handleUp]);

    useAnimationFrame(() => {
        onValue && onValue(value);
    });

    const containerStyle = { border: 1, width: 128, position: 'absolute', bottom: 25, opacity: 0.5, touchAction: 'none' };
    if (left) {
        containerStyle.left = 25;
    } else {
        containerStyle.right = 25;
    }
    return (
        <div style={containerStyle}>
            <img src={joystickBase}/>
            <div onMouseDown={handleDown} 
                ref={stick} style={{ position: 'absolute', left: 32, top: 32 }}>
            <img src={joystickRed}/>    
            </div>
        </div>
      );
}

Joystick.defaultProps = {
    maxDistance: 64,
    deadzone: 8,
    left: true,
    onValue: null,
}

export default Joystick;