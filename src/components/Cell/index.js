import React from 'react';

const Cell = (props) => {
    return <div className={ "cell " + props.matrix[props.x][props.y].tetromino + ((props.matrix[props.x][props.y].ghost) ? " ghost" : "") }></div>;
}

export default Cell;