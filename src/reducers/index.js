import { combineReducers } from 'redux'
import timer from "./timer";
import matrix from "./matrix";
import next from "./next";
import hold from "./hold";
import stat from "./stat";
import gravity from "./gravity";

export default combineReducers({
  timer: timer,
  matrix: matrix,
  nextTetrominos: next,
  holding: hold,
  stats: stat,
  gravityInterval: gravity
})