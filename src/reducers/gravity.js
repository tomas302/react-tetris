const gravity = (state = 800, action) => {
    switch(action.type) {
        case 'REDUCE_GRAVITY':
            let newGravity = state - action.amount;
            if (newGravity < 60) {
                return 60;
            }
            return newGravity;
        default:
            return state;
    }
};
export default gravity;