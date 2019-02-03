import { WIDTH, HEIGHT } from '../constants';


// 2D array containing all the cells in the Matrix. It has the form 'cells[x][y]'
const initialMatrix = [];
for (let x = 0; x < WIDTH; x++) {
    let column = [];
    for (let y = 0; y < HEIGHT; y++) {
        column.push({ tetromino: 'none' });
    }
    initialMatrix.push(column);
}

const matrix = (state = initialMatrix, action) => {
    switch(action.type) {
        case 'CHANGE_MATRIX':
            let newMatrix = Object.assign({}, state);
            for (let i = 0; i < action.cells.length; i++) {
                let cell = action.cells[i];
                newMatrix[cell[0]][cell[1]].tetromino = action.tetromino;
            }
            return newMatrix;
        default:
            return state;
    }
};

export default matrix;