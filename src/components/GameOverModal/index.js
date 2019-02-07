import React from 'react';
import ReactModal from 'react-modal';
import './GameOverModal.css';

class GameOverModal extends React.Component {

    constructor(props) {
        super(props);

        this.handler = this.handler.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handler() {
        if (!this.props.paused)
            this.props.handler();
    }

    handleCloseModal(event) {
        this.props.handler(event);
    }

    render() {
        if (!this.props.gameOver) {
            return <React.Fragment></React.Fragment>;
        }
        return <div id="GameOver" className={ "" } onClick={ this.handler }>
            <ReactModal
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
                <button className={ "unselectable" } onClick={this.handleCloseModal}>PLAY AGAIN</button>
                <button className={ "unselectable" } onClick={this.handleCloseModal}>BACK</button>
            </ReactModal>
        </div>;
    }
}

export default GameOverModal;