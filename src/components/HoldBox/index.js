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
        let holding;
        if (this.props.tetrominoHeld !== "none") {
            holding = getTetrominoProperties(this.props.tetrominoHeld).shape[0];
        }
        
        let matrix = [];
        let width = (this.props.tetrominoHeld === "I") ? 4 : (this.props.tetrominoHeld === "O") ? 2 : 3;
        for (let y = 0; y < 2; y++) {
            let column = [];
            for (let x = 0; x < width; x++) {
                let tetromino = "none";
                if (holding) {
                    for (let i = 0; i < holding.length; i++) {
                        switch(this.props.tetrominoHeld) {
                            case("I"):
                                if (holding[i][0] + 2 === x && holding[i][1] + 1 === y) {
                                    tetromino = this.props.tetrominoHeld;
                                }
                                break;
                            case("O"):
                                if (holding[i][0] + 1 === x && holding[i][1] === y) {
                                    tetromino = this.props.tetrominoHeld;
                                }
                                break;
                            default:
                                if (holding[i][0] + 1 === x && holding[i][1] + 1 === y) {
                                    tetromino = this.props.tetrominoHeld;
                                }
                                break;
                        }
                    }
                }
                column.push(<HoldCell key={ y * 3 + x * 4 } tetromino={ tetromino } />);
            }
            matrix.push(column);
        }
        
        return <div id="HoldBox">
            <h2>HOLD</h2>
            <div id="holder">
                <div id={"hold-matrix-" + width}>
                    {matrix}
                </div>
            </div>
        </div>;
    }
}

export default HoldBox;