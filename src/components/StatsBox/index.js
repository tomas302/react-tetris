import React from 'react';
import './StatsBox.css';

const StatsBox = (props) => {
        return <div id="StatsBox">
            <div>
                <h3>SCORE</h3>
                <div className="stat">
                { props.score }
                </div>
            </div>
            <div>
                <h3>LEVEL</h3>
                <div className="stat">
                { props.level }
                </div>
            </div>
            <div>
                <h3>LINES</h3>
                <div className="stat">
                { props.lines }
                </div>
            </div>
        </div>;
}

export default StatsBox;