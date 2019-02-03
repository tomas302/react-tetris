import React, { Component } from 'react';
import './Game.css';
import Matrix from "../../containers/matrix";

window.accurateInterval = function(fn, time) {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function() {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = function() {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel
    };
};



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

class NextBox extends Component {

    render() {
        return <div>

        </div>;
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        
        this.startGame = this.startGame.bind(this);
    }

    componentDidMount() {

    }

    // Game logic
    startGame() {

    }



    render () {
        return <div id="Game">
            <Matrix />
        </div>;
    }
}

export default Game;