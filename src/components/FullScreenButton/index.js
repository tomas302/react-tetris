import React from 'react';
import './FullScreenButton.css';

const FullScreenButton = (props) => {
    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isOpera = typeof window.opr !== "undefined";
    var isIEedge = winNav.userAgent.indexOf("Edge") > -1;

    if(
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
    ) {
        let icon = (props.fullscreen) ? <i className="fas fa-compress-arrows-alt"></i> : <i className="fas fa-expand-arrows-alt"></i>;
        return <button id="FullScreenButton" onClick={ props.handler }>{icon}</button>;
    } else { 
        return <React.Fragment></React.Fragment>;
    }
    
};

export default FullScreenButton;