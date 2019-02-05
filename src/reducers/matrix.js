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
    let newMatrix;
    switch(action.type) {
        case 'CHANGE_MATRIX':
            newMatrix = Object.assign({}, state);
            for (let i = 0; i < action.cells.length; i++) {
                let cell = action.cells[i];
                newMatrix[cell[0]][cell[1]].tetromino = action.tetromino;
            }
            return newMatrix;
        case 'COPY_MATRIX':
            newMatrix = action.newMatrix;
            let lowerLine = action.lowerLine;
            if (lowerLine + 1 < HEIGHT) {
                for (let y = lowerLine + 1; y < HEIGHT; y++) {
                    for (let x = 0; x < WIDTH; x++) {
                        newMatrix[x][y].tetromino = state[x][y].tetromino;
                    }
                }
                return newMatrix;
            } else {
                return newMatrix;
            }
        default:
            return state;
    }
};

export default matrix;