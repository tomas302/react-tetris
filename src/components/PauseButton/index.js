import React from 'react';
import ReactModal from 'react-modal';
import ControlInformation from '../ControlInformation';
import './PauseButton.css';

class PauseButton extends React.Component {

    constructor(props) {
        super(props);

        this.handler = this.handler.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleBackToStart = this.handleBackToStart.bind(this);
    }

    handler() {
        if (!this.props.paused)
            this.props.handler();
    }

    handleCloseModal(event) {
        this.props.handler(event);
    }

    handleBackToStart() {
        this.props.backToStart();
    }

    render() {
        let text = "";
        let icon;
        if (this.props.paused) {
            text = <i className="fas fa-play"></i>;
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
            <h1>PAUSE</h1>
            <div id="PauseButtonGroup">
                <button className={ "unselectable btn btn-success" } onClick={ this.handleCloseModal }><i className="fas fa-play"></i></button>
                { (!( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )) ? <ControlInformation isMobile={ this.props.isMobile } handler={ this.props.controlHandler } open={ this.props.openControls } /> : "" }
                <button className={ "unselectable btn btn-info" } onClick={ this.handleBackToStart }><i className="fas fa-home"></i></button>
            </div>
            </ReactModal>
        </div>;
    }
}

export default PauseButton;