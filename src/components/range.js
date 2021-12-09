import { useCallback } from "react";

const Range = ({ className, value, onChange }) => {
    const change = useCallback((e) => onChange(e.target.value), [onChange]);
    return <input className={className} type="range" min="1" max="255" 
        value={value} onChange={change}></input>;
}

export default Range;