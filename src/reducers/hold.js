const hold = (state = "none", action) => {
    switch(action.type) {
        case 'HOLD':
            return action.tetromino;
        default:
            return state;
    }
};
export default hold;