import { getRandomTetromino } from '../components/Tetromino/'

const next = (state = [], action) => {
    switch(action.type) {
        case 'INIT_NEXT_TETROMINOS':
            return getRandomTetromino(3);
        case 'LOAD_NEW_TETROMINO':
            return [state[1], state[2], getRandomTetromino()]
        default:
            return state;
    }
};
export default next;