import React from 'react';
import ReactModal from 'react-modal';
import './ControlInformation.css';

class ControlInformation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
        
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState({
            open: true
        });
    }

    handleCloseModal(event) {
        this.setState({
            open: false
        });
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
                    <li>MOVE: Right and left arrow</li>
                    <li>ROTATE: Up arrow</li>
                    <li>FALL FASTER: Down arrow</li>
                    <li>HARD DROP: Space</li>
                    <li>HOLD: C</li>
                </ul>
            </div>;
        }
        return <div>
            <button onClick={ this.handleOpenModal }  id="OpenControlsButton" className="btn btn-warning" >HOW TO PLAY</button>
            <ReactModal
                isOpen={this.state.open}
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