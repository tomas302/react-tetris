import { combineReducers } from 'redux'
import timer from "./timer";
import matrix from "./matrix";

export default combineReducers({
  timer: timer,
  matrix: matrix
})