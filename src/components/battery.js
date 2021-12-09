function Battery({ level }) {
    return (
        <div className="batteryContainer">
            <div className="batteryOuter"><div className="batteryLevel" style={{ width: 25 * level / 100 }}></div></div>
            <div className="batteryBump"></div>
        </div>
    );
}

export default Battery;
