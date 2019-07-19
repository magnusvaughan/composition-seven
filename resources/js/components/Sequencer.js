import React, { Component } from 'react'
import Tone from 'tone';
import update from 'immutability-helper';

// Composition Seven
var synth = new Tone.MonoSynth({
	"oscillator" : {
		"type" : "square"
 },
 "envelope" : {
 	"attack" : 0.1
 }
}).toMaster();

//State
var playing = false;
class Sequencer extends Component {
    constructor () {
        super()
        this.state = {
            playing: false,
            notes: ["C5","B4","A4","G4","F4","E4","D4","C4"],
            cellCount: 16,
            sequencerState: []
        }
        this.playSequence = this.playSequence.bind(this);
        this.toggleSequence = this.toggleSequence.bind(this);
        this.toggleOnState = this.toggleOnState.bind(this);
        this.resetActiveState = this.resetActiveState.bind(this);
    }

    componentDidMount () {
        let cells = [];
        for (var i = 0; i < this.state.notes.length; i++) {
            let rowState = [];
            for (let j = 0; j < this.state.cellCount; j++) {
                rowState.push({
                    dataCellNumber: j,
                    dataCellRow: this.state.notes[i],
                    dataOn: false,
                    dataActive: false
                });
            }
            cells.push({
                dataRowNumber: this.state.notes[i],
                rowDataCells: rowState
            });
            this.setState({
                sequencerState: cells
            });
        }
    }

    playSequence() {
       
        var seq = new Tone.Sequence((time, note) => {
            var sequenceCellNumber = Math.floor((Tone.Transport.seconds * 2)  % 16);
            if(sequenceCellNumber === 0) {
                var columnIndexToChange = this.state.cellCount - 1;
            }
            else {
                var columnIndexToChange = sequenceCellNumber - 1;
            }
            for(var i = 0; i <= this.state.notes.length; i++) {
                const removeActiveData = update(this.state, {
                    sequencerState:{[i]: {rowDataCells:{[columnIndexToChange]: {dataActive: {$set: false}}}}}
                });
                this.setState(removeActiveData);
                const addActiveData = update(this.state, {
                    sequencerState:{[i]: {rowDataCells:{[sequenceCellNumber]: {dataActive: {$set: true}}}}}
                });
                this.setState(addActiveData);
                if(this.state.sequencerState[i].rowDataCells[sequenceCellNumber].dataOn) {
                    var noteToPlay = this.state.sequencerState[i].rowDataCells[sequenceCellNumber].dataCellRow;
                    synth.triggerAttackRelease(noteToPlay, '8n');
                }
            }
        }, ["C4"]);
        seq.start(0);
    }

    resetActiveState() {
        let copiedState = this.state;
        for(var i = 0; i < this.state.notes.length; i++) {
            for(var j = 0; j < this.state.cellCount; j++) {
                copiedState.sequencerState[i].rowDataCells[j].dataActive = false;
            }
        }
        this.setState(copiedState);
    }

    toggleSequence() {
        if(this.state.playing) {
            Tone.Transport.stop();
            this.resetActiveState();
            this.setState({playing : false});
        }
        else {
            Tone.Transport.seconds = 0;
            Tone.Transport.start();
            this.playSequence();
            this.setState({playing : true});
        }
    }

    toggleOnState(e) {
        const sequencerState = this.state.sequencerState;
        const cellRowNumber = e.target.getAttribute('data-cell-row');
        const rowPosition = sequencerState.map(function(row) { return row.dataRowNumber; }).indexOf(cellRowNumber);
        const dataCellNumber = parseInt(e.target.getAttribute('data-cell-number'));
        const cellPosition = sequencerState[rowPosition].rowDataCells.map(function(cell) { return cell.dataCellNumber; }).indexOf(dataCellNumber);
        const newData = update(this.state, {
            sequencerState:{[rowPosition]: {rowDataCells:{[cellPosition]: {dataOn: {$set: !sequencerState[rowPosition].rowDataCells[cellPosition].dataOn}}}}}
        });
        this.setState(newData);
    }

    render () {
        let grid = [];
        let sequencerState = this.state.sequencerState;
        sequencerState.forEach((row, i) => {
            let cells = [];
            row.rowDataCells.forEach(cell => { 
                var cellClasses = 'column ';
                if(cell.dataOn) {
                    cellClasses+='on-cell ';
                }
                if(cell.dataActive) {
                    cellClasses+='active-cell'
                }
                cells.push(
                    <div onClick={this.toggleOnState} 
                        className={cellClasses} 
                        data-cell-number={cell.dataCellNumber} 
                        data-cell-row={cell.dataCellRow} 
                        data-on={cell.dataOn} 
                        data-active={cell.dataActive} 
                        key={i + parseInt(cell.dataCellNumber)}>
                    </div>
                );
            });
            grid.push(
                <div className="grid-row" data-row-note={row.dataRowNumber} key={row.dataRowNumber}>
                    {cells}
                </div>
            )
        });
        
        return (
            <div className="content">
                <div className="button-wrapper">
                    <button onClick={this.toggleSequence} id="make-some-noise" className="btn btn-1 btn-1e">noise</button>
                </div>
                <div className="grid-wrapper">
                    {grid}
                </div>
            </div>
        )
    }
}

export default Sequencer