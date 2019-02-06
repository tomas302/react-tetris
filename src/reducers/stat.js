const defaultState = {
    score: 0,
    level: 1,
    lines: 0
};

const stat = (state = defaultState, action) => {
    switch(action.type) {
        case 'ADD_SCORE':
            return {...state, score: state.score + action.points};
        case 'ADD_LINES':
            let pastLinesStr = state.lines.toString();
            let newLinesStr = (state.lines + action.lines).toString();
            let addLevel;
            if (pastLinesStr.length > 1) {
                if (newLinesStr[pastLinesStr.length - 2] > pastLinesStr[pastLinesStr.length - 2]) {
                    addLevel = newLinesStr[pastLinesStr.length - 2] - pastLinesStr[pastLinesStr.length - 2]
                }
            } else if (newLinesStr.length > 1) {
                addLevel = newLinesStr.length - 1;
            }
            return {...state, lines: state.lines + action.lines, level: state.level + ((addLevel !== undefined) ? addLevel : 0)};
        default:
            return state;
    }
};
export default stat;