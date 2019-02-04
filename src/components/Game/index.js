import React, { Component } from 'react';
import './Game.css';
import Matrix from "../../containers/matrix";
import NextBox from "../../containers/next";
import { initNextTetrominos, startTimer } from '../../actions';
import { connect } from "react-redux";
import { getRandomTetromino, getTetrominoProperties, changeTetrominoPosition } from "../Tetromino/";
import { changeMatrix } from '../../actions';
import cell from '../../containers/cell';
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
        this.moveTetromino = this.moveTetromino.bind(this);
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
        // enable controls
    }

    gameTick() {
        //this.moveTetromino(0, 0);
        //this.rotateTetromino(false);
        if (Date.now() - this.state.lastTimeGravityWasApplied > this.state.gravityInterval) {
            // this.moveTetromino(0, 1);
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

    spawnNextTetromino() {
        // spawn next tetromino with coordinates (5, 1)
        let nextTetromino = getRandomTetromino();
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

    moveTetromino(x, y) {
        let pastPosition = this.state.tetromino.position;

        // check collisions
        let currentShape = this.state.tetromino.tetrominoProps.shape[this.state.tetromino.orientation];
        // first check with the borders of the matrix
        let canMove = true;

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
            return false;
        });
        if (!canMove) return;
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

    // true -> right, false -> left
    rotateTetromino() {
        // I have designed my wall kick system (how to rotate a tetromino when it's against a wall)
        // following this site's rules https://tetris.fandom.com/wiki/TGM_Rotation

        let newOrientation = (this.state.tetromino.orientation + 1 > 3) ? 0 : this.state.tetromino.orientation + 1;
        let position = this.state.tetromino.position;
        // get the current shape of the tetromino
        // "yes" if it can without wall kick, "no" if it can't without wall kick, "right" if it has to move 1 block to the right and "left" if it has to move 1 block to the left
        let canRotate = "yes";
        // edge case. when the tetromino I is rotated with the center in a bad spot and near a matrix edge
        if (this.state.tetromino.type === "I" && ((position[0] === 10 && this.state.tetromino.orientation === 3) || (position[0] === 0 && this.state.tetromino.orientation === 1)) ) {
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
            if (newX < 0 || newX > WIDTH - 1) {
                canRotate = "no";
                return true;
            }
            let newY = position[1] + element[1];
            if (newY < 0 || newY > HEIGHT - 1) {
                canRotate = "no";
                return true;
            }
            return false;
        });
        // it can't perform a basic rotation, so we check for the wall kicks
        if (canRotate === "no") {
            canRotate = "right";
            nextShape.some(element => {
                let newX = position[0] + element[0] + 1;
                if (newX < 0 || newX > WIDTH - 1) {
                    canRotate = "no";
                    return true;
                }
                let newY = position[1] + element[1];
                if (newY < 0 || newY > HEIGHT - 1) {
                    canRotate = "no";
                    return true;
                }
                return false;
            });
            if (canRotate === "no") {
                canRotate = "left";
                nextShape.some(element => {
                    let newX = position[0] + element[0] - 1;
                    if (newX < 0 || newX > WIDTH - 1) {
                        canRotate = "no";
                        return true;
                    }
                    let newY = position[1] + element[1];
                    if (newY < 0 || newY > HEIGHT - 1) {
                        canRotate = "no";
                        return true;
                    }
                    return false;
                });
            }
        }
        if (canRotate === "no") {
            return ;
        }
        let newPosition = [position[0], position[1]]
        switch(canRotate) {
            case("right"):
                newPosition[0] += 1;
                break;
            case("left"):
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