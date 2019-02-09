import React from 'react';
import ReactModal from 'react-modal';
import './Leaderboard.css';

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        let [isNewRecord, newPosition] = this.props.newRecord();
        this.state = {
            isNewRecord: isNewRecord,
            newPosition: newPosition,
            name: ''
        };

        this.setNewRecord = this.setNewRecord.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    setNewRecord() {
        if (!this.state.isNewRecord) return;
        this.props.setNewRecord(this.state.name, this.state.newPosition);
        this.setState({
            isNewRecord: false
        });
    }

    onChange(e) {
        const re = /[a-zA-Z0-9]{0,3}/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({
                name: e.target.value
            })
        }
    }

    render() {
        if (this.state.isNewRecord) {
            return <ReactModal
                ariaHideApp={false}
                isOpen={true}
                contentLabel="NEW RECORD"
                className="NewRecordModal"
                overlayClassName="NewRecordOverlay"
            >
                <h1>NEW RECORD!!!</h1>
                <label htmlFor="name">Your Name:</label>
                <input style={{ textAlign: 'center' }} id="name" type='text' onChange={this.onChange} value={this.state.name}></input>
                <button className={"unselectable btn btn-success"} onClick={this.setNewRecord}><i className="fas fa-save"></i></button>
            </ReactModal>;
        } else {
            let data = this.props.data;
            let rows = [];
            for (let i = 0; i < data.length; i++) {
                rows.push(<tr key={i}><td>{data[i].name}</td><td style={{ float: 'right' }}>{data[i].score}</td></tr>);
            }
            return <div>
                <h5 style={{ textAlign: 'center' }}>LEADERBOARD</h5>
                <table className="table table-dark" style={{ width: '250px' }}>
                    <tbody>
                        {rows}
                    </tbody>
                </table></div>;
        }
    }
}

export default Leaderboard;