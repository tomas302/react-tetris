import {connect} from "react-redux";
import Game from '../components/Game';

function mapStateToProps(store){
    return {
        matrix: store.matrix,
        nextTetromino: store.nextTetrominos[0],
        timer: store.timer,
        tetrominoHeld: store.holding
    }
}

export default connect(mapStateToProps) (Game);