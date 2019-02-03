import {connect} from "react-redux";
import Matrix from '../components/Matrix/';

function mapStateToProps(store){
    return {
        matrix: store.matrix,
    }
}

export default connect(mapStateToProps) (Matrix);