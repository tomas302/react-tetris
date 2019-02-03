import React from 'react';
import Cell from '../components/Cell';


const WIDTH=10;
const HEIGHT=20;


// 2D array containing all the cells in the Matrix. It has the form 'cells[x][y]'
const initialMatrix = [];
for (let x = 0; x < WIDTH; x++) {
    let column = [];
    for (let y = 0; y < HEIGHT; y++) {
        column.push(<Cell tetromino={ "none" } />);
    }
    initialMatrix.push(column);
}

const matrix = (state = initialMatrix, action) => {
    switch(action.type) {
        default:
            return state;
    }
};

export default matrix;