import React, { Component } from 'react';

class Cell extends Component {
    render() {
        return <div className={ "cell " + this.props.matrix[this.props.x][this.props.y].tetromino }></div>
    }
}

export default Cell;