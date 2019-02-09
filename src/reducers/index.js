import { combineReducers } from 'redux'
import timer from "./timer";
import matrix from "./matrix";
import next from "./next";
import hold from "./hold";
import stat from "./stat";
import gravity from "./gravity";
import gameKey from "./gameKey";
import rootReducer from './game';


export const appReducers = combineReducers({
  gameKey: gameKey,
  timer: timer,
  matrix: matrix,
  nextTetrominos: next,
  holding: hold,
  stats: stat,
  gravityInterval: gravity
});

export default rootReducer;