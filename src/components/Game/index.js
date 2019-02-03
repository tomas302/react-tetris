import React, { Component } from 'react';
import './Game.css';
import Matrix from "../../containers/matrix";
import NextBox from "../../containers/next";
import { initNextTetrominos, startTimer } from '../../actions';
import { connect } from "react-redux";

/*
class HoldBox extends Component {

    render() {
        return <div>

        </div>;
    }
}

class StatsBox extends Component {

    render() {
        return <div>

        </div>;
    }
}

class PauseButton extends Component {

    render() {
        return <div>

        </div>;
    }
}
*/


class Game extends Component {
    constructor(props) {
        super(props);
        
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {
        this.startGame();
    }

    // Game logic
    startGame() {
        // start countdown
        this.props.dispatch(initNextTetrominos());
        // spawn first Tetromino
        this.props.dispatch(startTimer(600));
        // enable controls
    }

    render () {
        return <div id="Game">
            <Matrix />
            <div id="right-panel">
                <NextBox />
            </div>
        </div>;
    }
}

export default connect() (Game);