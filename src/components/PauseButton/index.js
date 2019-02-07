import React from 'react';
import ReactModal from 'react-modal';
import './PauseButton.css';

class PauseButton extends React.Component {

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
        let text = "";
        let icon;
        if (this.props.paused) {
            text = "PAUSED";
        } else {
            icon = <i id="PauseIcon" className="fas fa-pause"></i>;
        }
        return <div id="PauseButton" className={((this.props.paused) ? "paused" : "") + " unselectable"} onClick={ this.handler }>
            { icon }
            <b>{text}</b>
            <ReactModal
                ariaHideApp={false}
                isOpen={this.props.paused}
                contentLabel="PAUSED"
                className="PauseModal"
                overlayClassName="PauseOverlay"
            >
            <button className={ "unselectable" } onClick={this.handleCloseModal}>RESUME</button>
            </ReactModal>
        </div>;
    }
}

export default PauseButton;