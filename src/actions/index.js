export const changeMatrix = (cells, tetromino) => ({
    type: 'CHANGE_MATRIX',
    cells: cells,
    tetromino: tetromino
})

export const initNextTetrominos = () => ({
    type: 'INIT_NEXT_TETROMINOS'
})

export const startTimer = (delay) => ({
    type: 'START_TIMER',
    delay: delay
})

export const stopTimer = () => ({
    type: 'STOP_TIMER'
})