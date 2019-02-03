import { combineReducers } from 'redux'
import timer from "./timer";
import matrix from "./matrix";
import next from "./next";

export default combineReducers({
  timer: timer,
  matrix: matrix,
  nextTetrominos: next
})