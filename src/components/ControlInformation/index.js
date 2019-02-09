import React from 'react';
import ReactModal from 'react-modal';
import './ControlInformation.css';

class ControlInformation extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.props.handler();
    }

    handleCloseModal(event) {
        this.props.handler();
    }

    render() {
        let controls;
        if (this.props.isMobile) {
            controls = <div id="ControlInformation">
                <h3><u>HOW TO PLAY</u></h3>
                <ul>
                    <li>MOVE: Swipe right and left</li>
                    <li>ROTATE: Swipe up</li>
                    <li>FALL FASTER: Hold the screen</li>
                    <li>HARD DROP: Swipe down</li>
                    <li>HOLD: Double tap</li>
                </ul>
            </div>;
        } else {
            controls = <div id="ControlInformation">
                <h3><u>HOW TO PLAY</u></h3>
                <ul>
                    <li>MOVE: <i className="fas fa-arrow-left"></i> <i className="fas fa-arrow-right"></i></li>
                    <li>ROTATE: <i className="fas fa-arrow-up"></i></li>
                    <li>FALL FASTER: <i className="fas fa-arrow-down"></i></li>
                    <li>HARD DROP: Space</li>
                    <li>HOLD: C</li>
                </ul>
            </div>;
        }
        
        let openButton;
        if (this.props.startScreen) {
            openButton = <button onClick={ this.handleOpenModal }  id="OpenControlsButton" className="btn btn-warning start-screen" >HOW TO PLAY</button>;
        } else {
            openButton = <button onClick={ this.handleOpenModal }  id="OpenControlsButton" className="btn btn-warning" ><i className="fas fa-book"></i></button>;
        }
        return <div>
            { openButton }
            <ReactModal
                ariaHideApp={false}
                isOpen={ this.props.open }
                contentLabel="HOW TO PLAY"
                className="ControlsModal"
                overlayClassName="ControlsOverlay"
            >
                {controls}
                <button id="CloseControlsButton" className="btn btn-danger" onClick={ this.handleCloseModal } >BACK</button>
            </ReactModal>
        </div>;
    }
};

export default ControlInformation;