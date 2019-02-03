import {connect} from "react-redux";
import Cell from '../components/Cell';

function mapStateToProps(store){
    return {
        matrix: store.matrix,
    }
}

export default connect(mapStateToProps) (Cell);