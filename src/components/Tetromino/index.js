const types = [
    "I",
    "J",
    "L",
    "O",
    "S",
    "T",
    "Z"
];
const color = {
    I: "cyan",
    J: "blue",
    L: "rgb(224, 146, 0)",
    O: "yellow",
    S: "lime",
    T: "purple",
    Z: "red"
};
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
            [1, 0],
            [-1, 0],
            [-2, 0],
        ],
        // second rotation
        [
            [0, 1],
            [0, -1],
            [0, -2],
        ],
        // third rotation
        [
            [1, 0],
            [-1, 0],
            [-2, 0],
        ],
        // fourth rotation
        [
            [0, 1],
            [0, -1],
            [0, -2],
        ]
    ],
    J: [
        // default rotation
        [
            [1, 0],
            [-1, 0],
            [-1, 1],
        ],
        // second rotation
        [
            [0, -1],
            [0, 1],
            [1, -1],
        ],
        // third rotation
        [
            [-1, 0],
            [1, 0],
            [1, -1],
        ],
        // fourth rotation
        [
            [0, 1],
            [0, -1],
            [-1, -1],
        ]
    ],
    L: [
        // default rotation
        [
            [-1, 0],
            [1, 0],
            [1, 1],
        ],
        // second rotation
        [
            [0, 1],
            [0, -1],
            [1, -1],
        ],
        // third rotation
        [
            [1, 0],
            [-1, 0],
            [-1, -1],
        ],
        // fourth rotation
        [
            [0, -1],
            [0, 1],
            [-1, -1],
        ]
    ],
    O: [
        // default rotation
        [
            [0, -1],
            [-1, -1],
            [-1, 0],
        ],
        // second rotation
        [
            [0, -1],
            [-1, -1],
            [-1, 0],
        ],
        // third rotation
        [
            [0, -1],
            [-1, -1],
            [-1, 0],
        ],
        // fourth rotation
        [
            [0, -1],
            [-1, -1],
            [-1, 0],
        ]
    ],
    S: [
        // default rotation
        [
            [1, 1],
            [0, 1],
            [-1, 0],
        ],
        // second rotation
        [
            [0, 1],
            [1, 0],
            [1, -1],
        ],
        // third rotation
        [
            [1, 0],
            [0, -1],
            [-1, -1],
        ],
        // fourth rotation
        [
            [-1, 1],
            [-1, 0],
            [0, -1],
        ]
    ],
    T: [
        // default rotation
        [
            [1, 0],
            [-1, 0],
            [0, 1],
        ],
        // second rotation
        [
            [0, 1],
            [0, -1],
            [1, 0],
        ],
        // third rotation
        [
            [1, 0],
            [-1, 0],
            [0, -1],
        ],
        // fourth rotation
        [
            [0, 1],
            [0, -1],
            [-1, 0],
        ]
    ],
    Z: [
        // default rotation
        [
            [1, 0],
            [0, 1],
            [-1, 1],
        ],
        // second rotation
        [
            [1, 1],
            [1, 0],
            [0, -1],
        ],
        // third rotation
        [
            [-1, 0],
            [0, -1],
            [1, -1],
        ],
        // fourth rotation
        [
            [-1, 0],
            [-1, -1],
            [0, 1],
        ]
    ]
};
const getRandomTetromino = () => {
    return {
        type: types[Math.floor(Math.random() * 7)],

    };
};
const getTetrominoProperties = (type) => {
    return {
        type: type,
        shape: shape[type]
    };
};

export { getRandomTetromino, getTetrominoProperties };