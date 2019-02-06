// matrix
export const changeMatrix = (cells, tetromino) => ({
    type: 'CHANGE_MATRIX',
    cells: cells,
    tetromino: tetromino
})

export const copyMatrix = (newMatrix, lowerLine) => ({
    type: 'COPY_MATRIX',
    newMatrix: newMatrix,
    lowerLine: lowerLine
})

// NextBox
export const initNextTetrominos = () => ({
    type: 'INIT_NEXT_TETROMINOS'
})

export const loadNewTetromino = () => ({
    type: 'LOAD_NEW_TETROMINO'
})

// HoldBox
export const holdCurrentTetromino = (tetromino) => ({
    type: 'HOLD',
    tetromino: tetromino
})

// timer
export const startTimer = (delay, fn) => ({
    type: 'START_TIMER',
    delay: delay,
    fn: fn
})

export const stopTimer = () => ({
    type: 'STOP_TIMER'
})