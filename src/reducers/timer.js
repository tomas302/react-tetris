const timer = (state = [], action) => {
    switch(action.type) {
        case 'START_TIMER':
            return state;
        case 'STOP_TIMER':
            return state;
        default:
            return state;
    }
};

export default timer;