import {connect} from "react-redux";
import NextBox from '../components/NextBox';

function mapStateToProps(store){
    return {
        nextTetrominos: store.nextTetrominos,
    }
}

export default connect(mapStateToProps) (NextBox);