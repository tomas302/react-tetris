import React, { Component } from 'react';
import './StatsBox.css';

class StatsBox extends Component {

    render() {
        return <div id="StatsBox">
            <div>
                <h3>SCORE</h3>
                <div className="stat">
                { this.props.score }
                </div>
            </div>
            <div>
                <h3>LEVEL</h3>
                <div className="stat">
                { this.props.level }
                { /* the game over sequence, implement the hard drop*/ }
                </div>
            </div>
            <div>
                <h3>LINES</h3>
                <div className="stat">
                { this.props.lines }
                { /* make it playable in mobile!*/ }
                </div>
            </div>
        </div>;
    }
}

export default StatsBox;