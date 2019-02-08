import React from 'react';
import './VolumeButton.css';

const VolumeButton = (props) => {
    let icon = (props.mute) ? <i className="fas fa-volume-mute"></i> : <i className="fas fa-volume-up"></i>;
    return <button id="VolumeButton" onClick={ props.handler }>{icon}</button>;
};

export default VolumeButton;