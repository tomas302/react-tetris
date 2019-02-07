import React, { Component } from 'react';
import './Game.css';
import Matrix from "../../containers/matrix";
import NextBox from "../../containers/next";
import HoldBox from "../../containers/hold";
import StatsBox from "../../containers/stat";
import PauseButton from "../PauseButton";
import FullScreenButton from "../FullScreenButton";
import GameOverModal from '../../containers/gameover';
import { connect } from "react-redux";
import { getRandomTetromino, getTetrominoProperties, changeTetrominoPosition, spawnTetromino, cleanTetromino } from "../Tetromino/";
import { initNextTetrominos, startTimer, loadNewTetromino, copyMatrix, stopTimer, holdCurrentTetromino } from '../../actions';
import { addScore, addLines, reduceGravity } from '../../actions';
import { WIDTH, HEIGHT } from '../../constants';

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: (window.innerWidth < 768),
            fullscreen: false,
            gameOver: false,
            paused: false,
            tetromino: {},
            rotate: false,
            canRotate: true,
            moveX: 0,
            pushDown: false,
            waitingToHold: false,
            timeDropped: Date.now(),
            // in miliseconds
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
        this.cleanCurrentTetromino = this.cleanCurrentTetromino.bind(this);
        this.holdTetromino = this.holdTetromino.bind(this);
        this.dropItHard = this.dropItHard.bind(this);
        this.calculateGhostPieceY = this.calculateGhostPieceY.bind(this);
        this.handlePauseButton = this.handlePauseButton.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleResize = this.handleResize.bind(this)
        this.handleFullscreenClick = this.handleFullscreenClick.bind(this);
        this.onFullscreenChange = this.onFullscreenChange.bind(this);

        document.onfullscreenchange = this.onFullscreenChange;
    }

    componentDidMount() {
        this.startGame();
        document.addEventListener("keydown", this.handleKeyDown, false);
        document.addEventListener("keyup", this.handleKeyUp, false);
        window.addEventListener("resize", this.handleResize, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
        document.removeEventListener("keyup", this.handleKeyUp, false);
        window.removeEventListener("resize", this.handleResize, false);
    }

    // Game logic
    startGame() {
        // start countdown
        this.props.dispatch(initNextTetrominos());
        this.spawnNextTetromino();
        this.props.dispatch(startTimer(60, this.gameTick));
    }

    gameTick() {
        if (Date.now() - this.state.lastTimeGravityWasApplied > this.props.gravityInterval) {
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
            this.props.dispatch(addScore(this.props.level));
            this.moveTetromino(0, 1);
        }
    }

    gameOver() {
        this.props.dispatch(stopTimer());
        this.setState({
            gameOver: true
        });
        // freeze game and open a new dialog
        // show score and maybe implement a leaderboard
        // give the choice to play again or go to the main menu
    }

    spawnNextTetromino(next, waitForHolding) {
        // spawn next tetromino with coordinates (5, 1)
        let nextTetromino = (next === undefined) ? getRandomTetromino() : next;
        let tetrominoProps = getTetrominoProperties(nextTetromino);

        let newTetrominoObject = {
            type: tetrominoProps.type,
            cells: [],
            ghostCells: [],
            ghostPosition: [],
            tetrominoProps: tetrominoProps,
            position: [5, (tetrominoProps.type === "O" || tetrominoProps.type === "I") ? 0 : 1],
            orientation: 0
        };

        newTetrominoObject.cells = spawnTetromino(newTetrominoObject, newTetrominoObject.position, this.props.dispatch, 0, this.props.matrix);

        if (newTetrominoObject.cells === false) { // cannot spawn because cells are occupied, thus the game is over
            this.gameOver();
            return;
        }

        let ghostY = this.calculateGhostPieceY(newTetrominoObject, newTetrominoObject.position);
        newTetrominoObject.ghostCells = this.getCellsByMoving(5, ghostY, tetrominoProps);
        newTetrominoObject.ghostPosition = [5, ghostY];

        this.setState({
            tetromino: newTetrominoObject,
            waitingToHold: (waitForHolding === undefined) ? false : waitForHolding
        });

        changeTetrominoPosition(newTetrominoObject, [5, newTetrominoObject.position[1]], this.props.dispatch, 0, this.calculateGhostPieceY(newTetrominoObject, newTetrominoObject.position));
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
        let score = 0;
        switch(completedLines.length) {
            case(1):
                score = 100 * this.props.level;
                break;
            case(2):
                score = 400 * this.props.level;
                break;
            case(3):
                score = 900 * this.props.level;
                break;
            case(4):
                score = 2000 * this.props.level;
                break;
            default:
                score = 1000;
                for (let i = 5; i <= completedLines.length; i++) {
                    score *= i;
                }
                score *= this.props.level;
                break;
        }
        this.props.dispatch(addScore(score));
        this.props.dispatch(copyMatrix(newMatrix, completedLines[completedLines.length - 1]));
        let currentLevel = this.props.level;
        this.props.dispatch(addLines(completedLines.length));
        if (this.props.level !== currentLevel) {
            this.props.dispatch(reduceGravity(150));
        }
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
                if (this.props.matrix[x][possibleLines[i]] && this.props.matrix[x][possibleLines[i]].tetromino === "none") {
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

    checkCollisionsByMoving(x, y, tetromino) {
        let pastPosition = tetromino.position;
        let currentShape = tetromino.tetrominoProps.shape[tetromino.orientation];
        let currentCells = tetromino.cells;
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
            if (!contained && this.props.matrix[newX][newY].tetromino !== "none" && !this.props.matrix[newX][newY].ghost) {
                canMove = false;
                return true;
            }
            return false;
        });
        return canMove;
    }

    getCellsByMoving(x, y, tetrominoProps) {
        let tempCells = [];
        tetrominoProps.shape[0].forEach(coord => {
            tempCells.push([x + coord[0], y + coord[1]]);
        });
        return tempCells;
    }

    moveTetromino(x, y) {
        let pastPosition = this.state.tetromino.position;

        // check collisions
        let canMove = this.checkCollisionsByMoving(x, y, this.state.tetromino);
        if (!canMove) {
            if (y === 1) {
                this.turnTetrominoIntoCells();
                return false;
            } else {
                return false;
            }
        }
        // after checking collisions, set new position
        let finalX = pastPosition[0];
        let finalY = pastPosition[1];
        finalX += x;
        finalY += y;
        let newPosition = [finalX, finalY];
        let ghostY = this.calculateGhostPieceY(this.state.tetromino, newPosition);
        let [cellsToChange, ghostCells] = changeTetrominoPosition(this.state.tetromino, newPosition, this.props.dispatch, this.state.tetromino.orientation, ghostY);
        
        this.setState({
            tetromino: {
                ...this.state.tetromino,
                cells: cellsToChange,
                ghostCells: ghostCells,
                ghostPosition: [newPosition[0], ghostY],
                position: newPosition,
            }
        });
        return canMove;
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
        let ghostY = this.calculateGhostPieceY(this.state.tetromino, newPosition, newOrientation);
        let [cellsToChange, ghostCells] = changeTetrominoPosition(this.state.tetromino, newPosition, this.props.dispatch, newOrientation, ghostY);

        this.setState({
            tetromino: {
                ...this.state.tetromino,
                position: newPosition,
                cells: cellsToChange,
                ghostCells: ghostCells,
                ghostPosition: [newPosition[0], ghostY],
                orientation: newOrientation
            }
        });
    }

    cleanCurrentTetromino() {
        cleanTetromino(this.state.tetromino, this.props.dispatch);
    }

    holdTetromino() {
        let currentTetrominoType = this.state.tetromino.type;
        this.setState({
            waitingToHold: true
        });
        this.cleanCurrentTetromino();
        if (this.props.tetrominoHeld !== "none") {
            this.spawnNextTetromino(this.props.tetrominoHeld, true);
        } else {
            this.spawnNextTetromino(this.props.nextTetromino, true);
            this.props.dispatch(loadNewTetromino());
        }
        this.props.dispatch(holdCurrentTetromino(currentTetrominoType));
    }

    dropItHard() {
        let dropAmount = this.state.tetromino.ghostPosition[1] - this.state.tetromino.position[1];
        this.moveTetromino(0, dropAmount);
        // for triggering the next tetromino
        this.moveTetromino(0, 1);
        let score = dropAmount * this.props.level;
        this.props.dispatch(addScore(score));
        this.setState({
            timeDropped: Date.now()
        });
    }
    
    // returns the Y coordinate of the ghost piece
    calculateGhostPieceY(tetromino, newPosition, newOrientation) {
        let tetro;
        if (tetromino)
            tetro = Object.assign({}, tetromino);
        else
            tetro = Object.assign({}, this.state.tetromino);
        let position = (newPosition) ? newPosition : tetro.position;
        tetro.position = position;
        
        if (typeof(newOrientation) === "number") tetro.orientation = newOrientation;
        for (let y = position[1] + 1; y <= HEIGHT; y++) {
            if (!this.checkCollisionsByMoving(0, y - position[1], tetro)) {
                return y - 1;
            }
        }
    }

    handlePauseButton() {
        if (this.state.gameOver) return;
        if (this.props.timer !== -1) {
            this.props.dispatch(stopTimer());
            this.setState({
                paused: true
            });
        } else {
            this.props.dispatch(startTimer(60, this.gameTick));
            this.setState({
                paused: false
            });
        }
    }

    handleKeyDown(event) {
        if (this.state.gameOver || this.props.timer === -1)
            return;
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
                break;
            case ("ArrowDown"):
                this.setState({
                    pushDown: true
                });
                break;
            case ("c" || "C"): // hold
                if (!this.state.waitingToHold) {
                    this.holdTetromino();
                }
                break;
            case (" "): // hard drop
                if (Date.now() - this.state.timeDropped > 100) {
                    this.dropItHard()
                }
                break;
            default:
                break;
        }
    }

    handleKeyUp(event) {
        if (this.state.gameOver || this.props.timer === -1)
            return;
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

    handleResize() {
        if(window.innerWidth < 768) {
            this.setState({ isMobile: true });
        } else {
            this.setState({ isMobile: false });
        }
    }

    handleFullscreenClick() {
        if (!this.state.fullscreen)
            document.body.requestFullscreen()
        else
            document.exitFullscreen()
    }

    onFullscreenChange(event) {
        this.setState({
            fullscreen: !this.state.fullscreen
        });
    }

    render() {
        if (this.state.isMobile) {
            return <div id="Game" className="unselectable container">
            <div id="Panel" className="col-xs-12 col-md-3">
                <div className="col-xs-2 col-md-12" id="left-panel">
                    <HoldBox />
                    <div>
                        <PauseButton handler={ this.handlePauseButton } paused={ this.state.paused } />
                        <FullScreenButton fullscreen={ this.state.fullscreen } handler={ this.handleFullscreenClick } />
                    </div>
                </div>
                <div className="col-xs-8 col-md-12">
                    <StatsBox />
                    <NextBox />
                </div>
            </div>
            <div className="col-xs-12 col-md-5" style={ {display: 'flex', justifyContent: 'center'} }>
                <Matrix />
            </div>
            <GameOverModal ariaHideApp={false} gameOver={ this.state.gameOver } restartGameHandler={ this.restartGame } backHandler={ this.returnToStartMenu } />
        </div>;
        } else {
            return <div id="Game" className="unselectable">
                <div id="left-panel">
                    <HoldBox />
                    <StatsBox />
                </div>
                <Matrix />
                <div id="right-panel">
                    <PauseButton handler={ this.handlePauseButton } paused={ this.state.paused } />
                    <NextBox />
                </div>
            </div>;
        }
    }
}

export default connect()(Game);