import React, { Component } from 'react';
import './Game.css';
import Matrix from "../../containers/matrix";
import NextBox from "../../containers/next";
import { initNextTetrominos, startTimer } from '../../actions';
import { connect } from "react-redux";
import { getRandomTetromino, getTetrominoProperties, changeTetrominoPosition } from "../Tetromino/";
import { changeMatrix } from '../../actions';
import cell from '../../containers/cell';

/*
class HoldBox extends Component {

    render() {
        return <div>

        </div>;
    }
}

class StatsBox extends Component {

    render() {
        return <div>

        </div>;
    }
}

class PauseButton extends Component {

    render() {
        return <div>

        </div>;
    }
}
*/


class Game extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            tetromino: {},
        }

        this.startGame = this.startGame.bind(this);
        this.gameTick = this.gameTick.bind(this);
        this.spawnNextTetromino = this.spawnNextTetromino.bind(this);
        this.moveTetromino = this.moveTetromino.bind(this);
        this.rotateTetromino = this.rotateTetromino.bind(this);
    }

    componentDidMount() {
        this.startGame();
    }

    // Game logic
    startGame() {
        // start countdown
        this.props.dispatch(initNextTetrominos());
        this.spawnNextTetromino();
        this.props.dispatch(startTimer(1200, this.gameTick));
        // enable controls
    }

    gameTick() {
        //this.moveTetromino(0, 0);
        //this.rotateTetromino(false);
    }

    spawnNextTetromino() {
        // spawn next tetromino with coordinates (5, 1)
        let nextTetromino = getRandomTetromino();
        let tetrominoProps = getTetrominoProperties(nextTetromino);

        let newTetrominoObject = {
            type: tetrominoProps.type,
            cells: [],
            tetrominoProps: tetrominoProps,
            position: [5, 1],
            orientation: 0
        };

        newTetrominoObject.cells = changeTetrominoPosition(newTetrominoObject, [5, 1], this.props.dispatch, 0);

        this.setState({
            tetromino: newTetrominoObject
        });
    }
    
    moveTetromino(x, y) {
        let pastPosition = this.state.tetromino.position;
        
        let finalX = pastPosition[0];
        let finalY = pastPosition[1];
        // check collisions

        // after checking collisions, set new position
        finalX += x;
        finalY += y;

        let cellsToChange = changeTetrominoPosition(this.state.tetromino, [finalX, finalY], this.props.dispatch);
        
        this.setState({
            tetromino: {
                ...this.state.tetromino,
                cells: cellsToChange,
                position: [finalX, finalY],
            }
        });
    }

    // true -> right, false -> left
    rotateTetromino(right) {
        // check wall kicks https://tetris.fandom.com/wiki/Wall_kick
        let newOrientation;
        if (right) {
            newOrientation = (this.state.tetromino.orientation + 1 > 3) ? 0 : this.state.tetromino.orientation + 1;
        } else {
            newOrientation = (this.state.tetromino.orientation - 1 < 0) ? 3 : this.state.tetromino.orientation - 1;
        }
        let cellsToChange = changeTetrominoPosition(this.state.tetromino, this.state.tetromino.position, this.props.dispatch, newOrientation);

        this.setState({
            tetromino: {
                ...this.state.tetromino,
                cells: cellsToChange,
                orientation: newOrientation
            }
        });
    }

    render () {
        return <div id="Game">
            <Matrix />
            <div id="right-panel">
                <NextBox />
            </div>
        </div>;
    }
}

export default connect() (Game);