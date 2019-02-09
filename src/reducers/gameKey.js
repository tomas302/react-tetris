const gameKey = (state = 0, action) => {
    if (action.type === 'RESET_GAME_STATE') {
        state = action.gameKey + 1;
    }
    return state;
};

export default gameKey;