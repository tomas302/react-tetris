import React from 'react';
import './StatsBox.css';

const StatsBox = (props) => {
        return <div id="StatsBox">
            <div className="col-xs-4 col-md-12">
                <h4>SCORE</h4>
                <div className="stat">
                { props.score }
                </div>
            </div>
            <div className="col-xs-4 col-md-12">
                <h4>LEVEL</h4>
                <div className="stat">
                { props.level }
                </div>
            </div>
            <div className="col-xs-4 col-md-12">
                <h4>LINES</h4>
                <div className="stat">
                { props.lines }
                </div>
            </div>
        </div>;
}

export default StatsBox;