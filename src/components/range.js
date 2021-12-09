const Range = ({ className, value, onChange }) => {
    return <input className={className} type="range" min="1" max="255" 
        value={value} onChange={(e) => onChange(e.target.value)}></input>;
}

export default Range;