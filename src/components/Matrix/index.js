import React, { Component } from 'react';
import Tetromino from "../../Tetromino";

// Component that contains the grid of cells and displays the game
class Matrix extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tetromino: Tetromino.getRandomTetromino()
        };
    }

    render() {
        return <div id="Matrix">
            {this.props.matrix}
        </div>;
    }
}

export default Matrix;