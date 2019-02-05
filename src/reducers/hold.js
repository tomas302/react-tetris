const hold = (state = {}, action) => {
    switch(action.type) {
        case 'HOLD':
            return action.tetromino;
        case 'RELEASE':
            return {};
        default:
            return state;
    }
};
export default hold;