import React, { Component } from 'react';
import { getTetrominoProperties } from '../Tetromino/';
import './NextBox.css';

class NextCell extends Component {
    render() {
        return <div className={ "next-cell " + this.props.tetromino }></div>
    }
}

class NextBox extends Component {

    render() {
        let nextTetrominos = [];
        let totalCells = 0;
        for (let i = 0; i < this.props.nextTetrominos.length; i++) {
            let cells = [];
            let shape = getTetrominoProperties(this.props.nextTetrominos[i]).shape[2];
            let size = (this.props.nextTetrominos[i] === "I") ? 4 : (this.props.nextTetrominos[i] === "O") ? 2 : 3;
            for (let y = 1; y < 3; y++) {
                for (let x = 0; x < size; x++) {
                    let print = false;
                    if (size === 3) {
                        shape.forEach(element => {
                            if (element[0] + 1 === x && element[1] + 1 === y) {
                                print = true;
                                return;
                            }
                        });
                    } else if (size === 4) {
                        shape.forEach(element => {
                            if (element[0] + 2 === x && element[1] === y) {
                                print = true;
                                return;
                            }
                        });
                    } else {
                        print = true;
                    }
                    
                    totalCells += 1;
                    if (print) {
                        cells.push(<NextCell key={ totalCells } tetromino={ this.props.nextTetrominos[i] } />)
                    } else {
                        cells.push(<NextCell key={ totalCells } tetromino={ "none" } />)
                    }
                }
            }
            nextTetrominos.push(<div className={ "next-matrix-"+ size  } key={ i }>
                {cells}
            </div>);
        }
        return <div id="NextBox">
            <h2>NEXT</h2>
            <div id="next-box">
                { nextTetrominos }
            </div>
        </div>;
    }
}

export default NextBox;