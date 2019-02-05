import { changeMatrix } from '../../actions';

const types = [
    "I",
    "J",
    "L",
    "O",
    "S",
    "T",
    "Z"
];
/*
    This object defines the shape of each type of Tetromino taking as relative center the rotation center defined by the official Super Rotation System(https://tetris.fandom.com/wiki/SRS).
    Because I need to have an actual coordinate in the cell grid (x, y) for performing the rotation,
    the Tetrominos "I" and "O" will use the closer block to the top right of the original rotation center defined in the SRS.

    So, for each Tetromino, I define their constituent blocks around the block that the SRS defines as center for rotation,
    except for the Tetrominos "I" and "O", taking the center block as the center for the coordinates.

    Also, there are 4 arrays for each Tetromino, for each of their possible rotations, with the position in (0, 0) taken for granted.

    I follow this image for the order of the rotations => https://vignette.wikia.nocookie.net/tetrisconcept/images/3/3d/SRS-pieces.png/revision/latest?cb=20060626173148
*/
const shape = {
    I: [
        // default rotation
        [
            [0, 0],
            [1, 0],
            [-1, 0],
            [-2, 0],
        ],
        // second rotation
        [
            [0, 0],
            [0, -1],
            [0, 1],
            [0, 2],
        ],
        // third rotation
        [
            [0, 1],
            [1, 1],
            [-1, 1],
            [-2, 1],
        ],
        // fourth rotation
        [
            [-1, 0],
            [-1, -1],
            [-1, 1],
            [-1, 2],
        ]
    ],
    J: [
        // default rotation
        [
            [0, 0],
            [1, 0],
            [-1, 0],
            [-1, -1],
        ],
        // second rotation
        [
            [0, 0],
            [0, -1],
            [1, -1],
            [0, 1],
        ],
        // third rotation
        [
            [0, 0],
            [-1, 0],
            [1, 0],
            [1, 1],
        ],
        // fourth rotation
        [
            [0, 0],
            [0, 1],
            [-1, 1],
            [0, -1],
        ]
    ],
    L: [
        // default rotation
        [
            [0, 0],
            [-1, 0],
            [1, 0],
            [1, -1],
        ],
        // second rotation
        [
            [0, 0],
            [0, -1],
            [0, 1],
            [1, 1],
        ],
        // third rotation
        [
            [0, 0],
            [1, 0],
            [-1, 0],
            [-1, 1],
        ],
        // fourth rotation
        [
            [0, 0],
            [0, -1],
            [-1, -1],
            [0, 1],
        ]
    ],
    O: [
        // default rotation
        [
            [0, 0],
            [0, 1],
            [-1, 1],
            [-1, 0],
        ],
        // second rotation
        [
            [0, 0],
            [0, 1],
            [-1, 1],
            [-1, 0],
        ],
        // third rotation
        [
            [0, 0],
            [0, 1],
            [-1, 1],
            [-1, 0],
        ],
        // fourth rotation
        [
            [0, 0],
            [0, 1],
            [-1, 1],
            [-1, 0],
        ]
    ],
    S: [
        // default rotation
        [
            [0, 0],
            [1, -1],
            [0, -1],
            [-1, 0],
        ],
        // second rotation
        [
            [0, 0],
            [0, -1],
            [1, 0],
            [1, 1],
        ],
        // third rotation
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [-1, 1],
        ],
        // fourth rotation
        [
            [0, 0],
            [-1, -1],
            [-1, 0],
            [0, 1],
        ]
    ],
    T: [
        // default rotation
        [
            [0, 0],
            [1, 0],
            [-1, 0],
            [0, -1],
        ],
        // second rotation
        [
            [0, 0],
            [0, -1],
            [0, 1],
            [1, 0],
        ],
        // third rotation
        [
            [0, 0],
            [1, 0],
            [-1, 0],
            [0, 1],
        ],
        // fourth rotation
        [
            [0, 0],
            [0, -1],
            [0, 1],
            [-1, 0],
        ]
    ],
    Z: [
        // default rotation
        [
            [0, 0],
            [1, 0],
            [0, -1],
            [-1, -1],
        ],
        // second rotation
        [
            [0, 0],
            [1, -1],
            [1, 0],
            [0, 1],
        ],
        // third rotation
        [
            [0, 0],
            [-1, 0],
            [0, 1],
            [1, 1],
        ],
        // fourth rotation
        [
            [0, 0],
            [-1, 0],
            [-1, 1],
            [0, -1],
        ]
    ]
};

const getRandomTetromino = (amount) => {
    if (amount) {
        if (amount > 10) throw Error("Why do you need so many Tetrominos??");
        let tetrominos = [];
        let availableTetro = types.slice();
        for (let i = 0; i < amount; i++) {
            if (i % types.length === 0 && i !== 0) {
                availableTetro = types.slice();
            }
            let randomIndex = Math.floor(Math.random() * availableTetro.length);
            tetrominos.push(availableTetro[randomIndex]);
            availableTetro.splice(randomIndex, 1);
        }
        return tetrominos;
    }
    let randomTetro = types[Math.floor(Math.random() * 7)];
    return randomTetro;
};
const getTetrominoProperties = (type) => {
    return {
        type: type,
        shape: shape[type]
    };
};

const spawnTetromino = (tetromino, newPosition, dispatch, newOrientation, matrix) => {
    let orientation = tetromino.orientation;
    if (newOrientation !== undefined) {
        orientation = newOrientation;
    }
    let pastCells = tetromino.cells;
    let type = tetromino.type;
    let tetrominoProps = tetromino.tetrominoProps;

    let cellsToChange = [];
    tetrominoProps.shape[orientation].forEach(coord => {
        cellsToChange.push([newPosition[0] + coord[0], newPosition[1] + coord[1]]);
    });
    if (pastCells.length === 0) {
        if (cellsToChange.some(cell => { if (matrix[cell[0]][cell[1]].tetromino !== "none") { return true; } return false; })) {
                return false;
        }
    } else {
        dispatch(changeMatrix(pastCells, "none"));
    }
    dispatch(changeMatrix(cellsToChange, type));
    return cellsToChange;
}

// if called with the same position, refreshes the cells. Useful for rotating.
const changeTetrominoPosition = (tetromino, newPosition, dispatch, newOrientation) => {
    let orientation = tetromino.orientation;
    if (newOrientation !== undefined) {
        orientation = newOrientation;
    }
    let pastCells = tetromino.cells;
    let type = tetromino.type;
    let tetrominoProps = tetromino.tetrominoProps;

    let cellsToChange = [];
    tetrominoProps.shape[orientation].forEach(coord => {
        cellsToChange.push([newPosition[0] + coord[0], newPosition[1] + coord[1]]);
    });
    dispatch(changeMatrix(pastCells, "none"));
    dispatch(changeMatrix(cellsToChange, type));
    return cellsToChange;
};

export { getRandomTetromino, getTetrominoProperties, changeTetrominoPosition, spawnTetromino };