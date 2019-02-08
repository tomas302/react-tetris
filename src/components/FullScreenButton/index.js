import React from 'react';
import './FullScreenButton.css';

const FullScreenButton = (props) => {
    let icon = (props.fullscreen) ? <i className="fas fa-compress-arrows-alt"></i> : <i className="fas fa-expand-arrows-alt"></i>;
    return <button id="FullScreenButton" onClick={ props.handler }>{icon}</button>;
};

export default FullScreenButton;