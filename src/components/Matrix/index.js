import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cell from '../../containers/cell';

import { WIDTH, HEIGHT } from '../../constants';

// Component that contains the grid of cells and displays the game
class Matrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    }

    componentDidMount() {
        this.props.gestureListener(ReactDOM.findDOMNode(this));
    }


    render() {
        return <div id="Matrix">
            { this.state.matrix }
        </div>;
    }
}

export default Matrix;