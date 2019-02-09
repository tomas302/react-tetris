import React from 'react';
import ReactModal from 'react-modal';
import './GameOverModal.css';

class GameOverModal extends React.Component {

    constructor(props) {
        super(props);

        this.handlePlayAgain = this.handlePlayAgain.bind(this);
        this.handleStartScreen = this.handleStartScreen.bind(this);
    }

    handlePlayAgain() {
        this.props.restartGameHandler();
    }

    handleStartScreen() {
        this.props.startScreenHandler();
    }

    render() {
        if (!this.props.gameOver) {
            return <React.Fragment></React.Fragment>;
        }
        return <div id="GameOver" className={ "" } onClick={ this.handler }>
            <ReactModal
                ariaHideApp={false}
                isOpen={this.props.gameOver}
                contentLabel="GAME OVER"
                className="GameOverModal"
                overlayClassName="GameOverOverlay"
            >
            <div className={ "container" }>

            </div>
                <b>GAME OVER</b>
                <p>
                    { this.props.score }
                    { this.props.level }
                    { this.props.lines }
                </p>
                <button className={ "unselectable" } onClick={this.handlePlayAgain}>PLAY AGAIN</button>
                <button className={ "unselectable" } onClick={this.handleStartScreen}>BACK</button>
            </ReactModal>
        </div>;
    }
}

export default GameOverModal;