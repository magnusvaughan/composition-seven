// import axios from 'axios'
import React, { Component } from 'react'
import Tone from 'tone';
import update from 'immutability-helper';
// import { Link } from 'react-router-dom'

// Composition Seven
var synth = new Tone.Synth().toMaster();
var button = document.getElementById("make-some-noise");

//DOM
var allCells = document.querySelectorAll('.column');

//State
var playing = false;

class Sequencer extends Component {
    constructor () {
        super()
        this.state = {
            notes: ["C4","D4","E4","F4","G4","A4","B4","C5"],
            cellCount: 16,
            sequencerState: []
        }
        this.playSequence = this.playSequence.bind(this);
        this.toggleSequence = this.toggleSequence.bind(this);
        this.toggleOnState = this.toggleOnState.bind(this);
    }

    componentDidMount () {
        let cells = [];
        for (var i=0; i<=this.state.notes.length; i++) {
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
            var sequenceCellNumber = Math.floor((time * 2)  % 16);
            // console.log("sequenceCellNumber", sequenceCellNumber)
            
            if(sequenceCellNumber === 0) {
                var columnIndexToChange = this.state.cellCount - 1;
            }
            else {
                var columnIndexToChange = sequenceCellNumber - 1;
            }

            for(var i = 0; i <= this.state.notes.length; i++) {
                // console.log("Removing active state from row " + i +" column " + columnIndexToChange);
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

            // var activeCells = document.querySelectorAll(`[data-cell-number=${CSS.escape(sequenceCellNumber)}]`);
            // for (var i = 0; i < activeCells.length; ++i) {
            //     activeCells[i].classList.add('active-cell');
            //     if(activeCells[i].className.match(/\bon-cell\b/)) {
            //         var noteToPlay = activeCells[i].parentNode.getAttribute('data-row-note');
            //         synth.triggerAttackRelease(noteToPlay, '8n');
            //     }
            // }
        //subdivisions are given as subarrays
        }, ["C4"]);
        seq.start(0);
    }

    toggleSequence() {
        if(playing) {
            Tone.Transport.stop();
            playing = false;
        }
        else {
            Tone.Transport.start();
            playing = true;
            this.playSequence();
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
            // console.log("re-render");
            let cells = [];
            row.rowDataCells.forEach(cell => { 
                // console.log("cell", cell);
                var cellClasses = 'column ';
                if(cell.dataOn) {
                    // console.log("Data is on");
                    cellClasses+='on-cell ';
                }
                if(cell.dataActive) {
                    // console.log("Cell is active");
                    cellClasses+='active-cell'
                }
                // console.log("cellClasses", cellClasses);
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