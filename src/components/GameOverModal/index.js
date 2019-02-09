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
                <b>GAME OVER</b>
                <p>
                    { this.props.score }
                    { this.props.level }
                    { this.props.lines }
                </p>
                <div id="GameOverButtonGroup">
                    <button className={ "unselectable btn btn-success" } onClick={this.handlePlayAgain}><i className="fas fa-redo-alt"></i></button>
                    <button className={ "unselectable btn btn-secondary" } onClick={this.handleStartScreen}><i className="fas fa-home"></i></button>
                </div>
            </ReactModal>
        </div>;
    }
}

export default GameOverModal;