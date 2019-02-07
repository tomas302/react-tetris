import React from 'react';

const FullScreenButton = (props) => {
    let icon = (props.fullscreen) ? <i className="fas fa-compress-arrows-alt"></i> : <i className="fas fa-expand-arrows-alt"></i>;
    return <button onClick={ props.handler }>{icon}</button>;
};

export default FullScreenButton;