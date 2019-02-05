import React, { Component } from 'react';
import './Game.css';
import Matrix from "../../containers/matrix";
import NextBox from "../../containers/next";
import { initNextTetrominos, startTimer } from '../../actions';
import { connect } from "react-redux";
import { getRandomTetromino, getTetrominoProperties, changeTetrominoPosition } from "../Tetromino/";
import { loadNewTetromino, copyMatrix } from '../../actions';
import { WIDTH, HEIGHT } from '../../constants';

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
            rotate: false,
            canRotate: true,
            moveX: 0,
            pushDown: false,
            // in miliseconds
            gravityInterval: 1000,
            lastTimeGravityWasApplied: Date.now()
        }

        this.startGame = this.startGame.bind(this);
        this.gameTick = this.gameTick.bind(this);
        this.spawnNextTetromino = this.spawnNextTetromino.bind(this);
        this.linesAchieved = this.linesAchieved.bind(this);
        this.turnTetrominoIntoCells = this.turnTetrominoIntoCells.bind(this);
        this.moveTetromino = this.moveTetromino.bind(this);
        this.rotationCalculations = this.rotationCalculations.bind(this);
        this.rotateTetromino = this.rotateTetromino.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount() {
        this.startGame();
        document.addEventListener("keydown", this.handleKeyDown, false);
        document.addEventListener("keyup", this.handleKeyUp, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
        document.removeEventListener("keyup", this.handleKeyUp, false);
    }

    // Game logic
    startGame() {
        // start countdown
        this.props.dispatch(initNextTetrominos());
        this.spawnNextTetromino();
        this.props.dispatch(startTimer(60, this.gameTick));
    }

    gameTick() {
        if (Date.now() - this.state.lastTimeGravityWasApplied > this.state.gravityInterval) {
            this.moveTetromino(0, 1);
            this.setState({
                lastTimeGravityWasApplied: Date.now()
            });
        }
        if (this.state.rotate) {
            this.rotateTetromino();
            this.setState({
                rotate: false
            });
        }
        if (this.state.moveX !== 0) {
            this.moveTetromino(this.state.moveX, 0);
            this.setState({
                moveX: 0
            });
        }
        if (this.state.pushDown) {
            this.moveTetromino(0, 1);
        }
    }

    spawnNextTetromino(next) {
        // spawn next tetromino with coordinates (5, 1)
        let nextTetromino = (next === undefined) ? getRandomTetromino() : next;
        let tetrominoProps = getTetrominoProperties(nextTetromino);

        let newTetrominoObject = {
            type: tetrominoProps.type,
            cells: [],
            tetrominoProps: tetrominoProps,
            position: [5, (tetrominoProps.type === "O" || tetrominoProps.type === "I") ? 1 : 2],
            orientation: 0
        };

        newTetrominoObject.cells = changeTetrominoPosition(newTetrominoObject, newTetrominoObject.position, this.props.dispatch, 0);

        this.setState({
            tetromino: newTetrominoObject
        });
    }

    /*
    this function is called when a new line or lines is or are scored,
    so it has to move all cells down by the number of lines completed
    that is below them in the matrix
    */
    linesAchieved(completedLines) {
        let newMatrix = [];
        for (let x = 0; x < WIDTH; x++) {
            let column = [];
            for (let y = 0; y < HEIGHT; y++) {
                column.push({ tetromino: 'none' });
            }
            newMatrix.push(column);
        }
        for (let i = completedLines.length - 1; i >= 0; i--) {
            let rowToClean = completedLines[i];
            for (let y = rowToClean; y >= 0; y--) {
                let amountToMove = completedLines.length - i;
                for (let x = 0; x < WIDTH; x++) {
                    if (y === rowToClean) {
                        newMatrix[x][y].tetromino = "none";
                    } else {
                        newMatrix[x][y + amountToMove].tetromino = this.props.matrix[x][y].tetromino;
                    }
                }
            }
        }
        this.props.dispatch(copyMatrix(newMatrix, completedLines[completedLines.length - 1]));
    }

    turnTetrominoIntoCells() {
        // once a tetromino lands, check if a line has been completed, spawn next one and update nextTetrominos array
        let cells = this.state.tetromino.cells;

        // an array containing the rows that have a new cell occupied because of the tetromino that just landed
        let possibleLines = [];
        // iterate through the cells array to find the rows affected by the tetromino that just landed
        cells.forEach(element => {
            let contained = possibleLines.some(storedLine => {
                if (element[1] === storedLine) {
                    return true;
                }
                return false;
            });
            if (!contained) {
                possibleLines.push(element[1]);
            }
        });
        let completedLines = [];
        for (let i = 0; i < possibleLines.length; i++) {
            let complete = true;
            for (let x = 0; x < WIDTH; x++) {
                // if one cell is empty, then is not a full line
                if (this.props.matrix[x][possibleLines[i]].tetromino === "none") {
                    complete = false;
                    break;
                }
            }
            if (complete)
                completedLines.push(possibleLines[i]);
        }
        if (completedLines.length !== 0) {
            this.linesAchieved(completedLines.sort());
        }

        this.spawnNextTetromino(this.props.nextTetromino);
        this.props.dispatch(loadNewTetromino());

    }

    moveTetromino(x, y) {
        let pastPosition = this.state.tetromino.position;

        // check collisions
        let currentShape = this.state.tetromino.tetrominoProps.shape[this.state.tetromino.orientation];
        let currentCells = this.state.tetromino.cells;
        let canMove = true;

        // first check with the borders of the matrix
        currentShape.some(element => {
            let newX = pastPosition[0] + element[0] + x;
            if (newX < 0 || newX > WIDTH - 1) {
                canMove = false;
                return true;
            }
            let newY = pastPosition[1] + element[1] + y;
            if (newY < 0 || newY > HEIGHT - 1) {
                canMove = false;
                return true;
            }
            // after that check for any existing cell
            let contained = currentCells.some(el => {
                if (el[0] === newX && el[1] === newY)
                    return true;
                return false;
            });
            if (!contained && this.props.matrix[newX][newY].tetromino !== "none") {
                canMove = false;
                return true;
            }
            return false;
        });
        if (!canMove) {
            if (y === 1) {
                this.turnTetrominoIntoCells();
                return;
            } else {
                return;
            }
        }
        // after checking collisions, set new position
        let finalX = pastPosition[0];
        let finalY = pastPosition[1];
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

    rotationCalculations(newX, newY, currentCells) {
        if (newX < 0 || newX > WIDTH - 1) {
            return [true, "no"];
        }
        if (newY < 0 || newY > HEIGHT - 1) {
            return [true, "no"];
        }
        let contained = currentCells.some(el => {
            if (el[0] === newX && el[1] === newY)
                return true;
            return false;
        });
        if (!contained && this.props.matrix[newX][newY].tetromino !== "none") {
            return [true, "no"];
        }
        return false;
    }

    // true -> right, false -> left
    rotateTetromino() {
        // I have designed my wall kick system (how to rotate a tetromino when it's against a wall)
        // following this site's rules https://tetris.fandom.com/wiki/TGM_Rotation

        let newOrientation = (this.state.tetromino.orientation + 1 > 3) ? 0 : this.state.tetromino.orientation + 1;
        let position = this.state.tetromino.position;
        let currentCells = this.state.tetromino.cells;
        // get the current shape of the tetromino
        // "yes" if it can without wall kick, "no" if it can't without wall kick, "right" if it has to move 1 block to the right and "left" if it has to move 1 block to the left
        let canRotate = "yes";
        // edge case. when the tetromino I is rotated with the center in a bad spot and near a matrix edge
        if (this.state.tetromino.type === "I" && ((position[0] === 10 && this.state.tetromino.orientation === 3) || (position[0] === 0 && this.state.tetromino.orientation === 1))) {
            newOrientation = (newOrientation === 0) ? 2 : 0;
            if (position[0] === 10) {
                position = [position[0] - 1, position[1]];
            } else {
                position = [position[0] + 1, position[1]];
            }
        }
        let nextShape = this.state.tetromino.tetrominoProps.shape[newOrientation];

        nextShape.some(element => {
            let newX = position[0] + element[0];
            let newY = position[1] + element[1];
            let result = this.rotationCalculations(newX, newY, currentCells);
            if (result[1] !== undefined)
                canRotate = result[1];
            return result[0];
        });
        // it can't perform a basic rotation, so we check for the wall kicks
        if (canRotate === "no") {
            canRotate = "right";
            nextShape.some(element => {
                let newX = position[0] + element[0] + 1;
                let newY = position[1] + element[1];
                let result = this.rotationCalculations(newX, newY, currentCells);
                if (result[1] !== undefined)
                    canRotate = result[1];
                return result[0];
            });
            if (canRotate === "no") {
                canRotate = "left";
                nextShape.some(element => {
                    let newX = position[0] + element[0] - 1;
                    let newY = position[1] + element[1];
                    let result = this.rotationCalculations(newX, newY, currentCells);
                    if (result[1] !== undefined)
                        canRotate = result[1];
                    return result[0];
                });
            }
        }
        if (canRotate === "no") {
            return;
        }
        let newPosition = [position[0], position[1]]
        switch (canRotate) {
            case ("right"):
                newPosition[0] += 1;
                break;
            case ("left"):
                newPosition[0] -= 1;
                break;
            default:
                break;
        }
        let cellsToChange = changeTetrominoPosition(this.state.tetromino, newPosition, this.props.dispatch, newOrientation);

        this.setState({
            tetromino: {
                ...this.state.tetromino,
                position: newPosition,
                cells: cellsToChange,
                orientation: newOrientation
            }
        });
    }

    handleKeyDown(event) {
        switch (event.key) {
            case ("ArrowRight"):
                this.setState({
                    moveX: 1
                });
                break;
            case ("ArrowLeft"):
                this.setState({
                    moveX: -1
                });
                break;
            case ("ArrowUp"):
                if (this.state.canRotate) {
                    this.setState({
                        rotate: true,
                        canRotate: false
                    });
                }
                //this.moveTetromino(0, -1);
                break;
            case ("ArrowDown"):
                this.setState({
                    pushDown: true
                });
                break;
            default:
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case ("ArrowUp"):
                if (!this.state.canRotate) {
                    this.setState({
                        canRotate: true
                    });
                }
                break;
            case ("ArrowDown"):
                this.setState({
                    pushDown: false
                });
                break;
            default:
                break;
        }
    }

    render() {
        return <div id="Game">
            <Matrix />
            <div id="right-panel">
                <NextBox />
            </div>
        </div>;
    }
}

export default connect()(Game);