import React from 'react';
import './ControlInformation.css';

const ControlInformation = (props) => {
    if (props.isMobile) {
        return <div id="ControlInformation">
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
        return <div id="ControlInformation">
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
};

export default ControlInformation;