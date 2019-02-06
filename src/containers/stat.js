import {connect} from "react-redux";
import StatsBox from '../components/StatsBox';

function mapStateToProps(store){
    return {
        score: store.stats.score,
        level: store.stats.level,
        lines: store.stats.lines
    }
}

export default connect(mapStateToProps) (StatsBox);