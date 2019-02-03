import { getRandomTetromino } from '../components/Tetromino/'

const next = (state = [], action) => {
    switch(action.type) {
        case 'INIT_NEXT_TETROMINOS':
            return getRandomTetromino(3);
        default:
            return state;
    }
};
export default next;