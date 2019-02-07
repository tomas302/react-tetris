import React from 'react';
import './PauseButton.css';

const PauseButton = (props) => {
    let text = "";
    if (props.paused) {
        text = "PAUSED";
    }
    return <div id="PauseButton" className={ ((props.paused) ? "paused" : "") + " unselectable" } onClick={props.handler}>
        <i id="PauseIcon" className="fas fa-pause"></i>
        <b>{ text }</b>
    </div>;
}

export default PauseButton;