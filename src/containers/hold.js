import {connect} from "react-redux";
import HoldBox from '../components/HoldBox';

function mapStateToProps(store){
    return {
        tetrominoHeld: store.holding,
    }
}

export default connect(mapStateToProps) (HoldBox);