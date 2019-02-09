import { appReducers } from './index';

const game = (state, action) => {
    if(action.type === 'RESET_GAME_STATE') {
        state = undefined;
    }
    return appReducers(state, action);
};

export default game;