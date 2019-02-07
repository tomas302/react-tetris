import {connect} from "react-redux";
import GameOverModal from '../components/GameOverModal';

function mapStateToProps(store){
    return {
        score: store.stats.score,
        level: store.stats.level,
        lines: store.stats.lines
    }
}

export default connect(mapStateToProps) (GameOverModal);