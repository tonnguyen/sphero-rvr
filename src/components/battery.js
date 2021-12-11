function Battery({ level }) {
    return (
        <div className="batteryContainer">
            <div className="batteryOuter">
                <div className="batteryLevel" 
                    style={{ width: 25 * level / 100, backgroundColor: level < 30 ? 'red' : '#73AD21' }}>{level}</div>
                </div>
            <div className="batteryBump"></div>
        </div>
    );
}

export default Battery;
