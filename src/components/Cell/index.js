import React from 'react';

const Cell = (props) => {
    return <div className={ "cell " + props.matrix[props.x][props.y].tetromino }></div>;
}

export default Cell;