import React, { Component } from 'react';
import Cell from '../../containers/cell';
import { getRandomTetromino, getTetrominoProperties } from "../Tetromino/";
import { changeMatrix } from '../../actions';
import { WIDTH, HEIGHT } from '../../constants';

// Component that contains the grid of cells and displays the game
class Matrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tetromino: '',
            matrix: []
        };

        const initialMatrix = [];
        for (let y = 0; y < HEIGHT; y++) {
            let column = [];
            for (let x = 0; x < WIDTH; x++) {
                column.push(<Cell key={ x * WIDTH + y * HEIGHT } x={ x } y={ y } />);
            }
            initialMatrix.push(column);
        }
        this.state.matrix = initialMatrix;

        this.spawnNextTetromino = this.spawnNextTetromino.bind(this);
        this.moveTetromino = this.moveTetromino.bind(this);
        this.rotateTetromino = this.rotateTetromino.bind(this);
    }

    componentDidMount() {
        
        this.spawnNextTetromino();
    }

    spawnNextTetromino() {
        // spawn next tetromino with coordinates (5, 1)
        let nextTetromino = getRandomTetromino();
        let tetrominoProps = getTetrominoProperties(nextTetromino.type);

        let offsetY = (nextTetromino.type === "I" || nextTetromino.type === "O") ? 0 : 1;
        let cellsToChange = [[5, 1 + offsetY]]
        tetrominoProps.shape[0].forEach(coord => {
            cellsToChange.push([5 + coord[0], 1 - coord[1] + offsetY]);
        });
        this.props.dispatch(changeMatrix(cellsToChange, nextTetromino.type));
        
        this.setState({
            tetromino: {
                type: nextTetromino,
                cells: cellsToChange
            }
        });
    }
    
    moveTetromino() {

    }

    rotateTetromino() {
        // check wall kicks https://tetris.fandom.com/wiki/Wall_kick
    }


    render() {
        return <div id="Matrix">
            { this.state.matrix }
        </div>;
    }
}

export default Matrix;