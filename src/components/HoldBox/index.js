import React, { Component } from 'react';
import { getTetrominoProperties } from '../Tetromino/';
import './HoldBox.css';

class HoldCell extends Component {
    render() {
        return <div className={ "hold-cell " + this.props.tetromino }></div>
    }
}

class HoldBox extends Component {

    render() {
        if (this.props.tetrominoHeld != {}) {
            let holding = this.props.tetrominoHeld;
        }
        let matrix = [];
        for (let y = 0; y < 3; y++) {
            let column = [];
            for (let x = 0; x < 4; x++) {
                column.push(<HoldCell tetromino={ "none" } />);
            }
            matrix.push(column);
        }
        
        return <div id="HoldBox">
            <h2>HOLD</h2>
            <div id="mirror">
                <div id="hold-matrix">
                    {matrix}
                </div>
            </div>
        </div>;
    }
}

export default HoldBox;