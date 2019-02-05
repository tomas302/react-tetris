import React, { Component } from 'react';
import { getTetrominoProperties } from '../Tetromino/';
import './StatsBox.css';

class StatsBox extends Component {

    render() {
        return <div id="StatsBox">
            <div>
                <h3>SCORE</h3>
                <div id="mirror">
                give me my props!
                </div>
            </div>
            <div>
                <h3>LEVEL</h3>
                <div id="mirror">
                finish the hold box, the game over sequence, implement the hard drop and pause
                </div>
            </div>
            <div>
                <h3>LINES</h3>
                <div id="mirror">
                change #mirror name and don't define it in 3 classes please... also make it playable in mobile!
                </div>
            </div>
        </div>;
    }
}

export default StatsBox;