// import axios from 'axios'
import React, { Component } from 'react'
import Tone from 'tone';
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
            for (let j = 0; j < this.state.cellCount-1; j++) {
                rowState.push({
                    dataCellNumber: j,
                    dataCellRow: this.state.notes[i],
                    dataOn: false
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
        var seq = new Tone.Sequence(function(time, note){
            console.log('note', note);
            var sequenceCellNumber = Math.floor((time * 2)  % 16);
            console.log(sequenceCellNumber);
            for (var i = 0; i < allCells.length; ++i) {
                allCells[i].classList.remove('active-cell');
            }
            var activeCells = document.querySelectorAll(`[data-cell-number=${CSS.escape(sequenceCellNumber)}]`);
            for (var i = 0; i < activeCells.length; ++i) {
                activeCells[i].classList.add('active-cell');
                if(activeCells[i].className.match(/\bon-cell\b/)) {
                    var noteToPlay = activeCells[i].parentNode.getAttribute('data-row-note');
                    synth.triggerAttackRelease(noteToPlay, '8n');
                }
            }
        //subdivisions are given as subarrays
        }, ["C4"]);
        seq.start(0);
    }

    toggleSequence() {
        if(playing) {
            console.log("I was playing");
            Tone.Transport.stop();
            playing = false;
        }
        else {
            console.log("I was not playing");
            Tone.Transport.start();
            playing = true;
            this.playSequence();
        }
    }

    toggleOnState(e) {
        // console.log(e.target);

        const sequencerState = this.state.sequencerState;
        const cellRowNumber = e.target.getAttribute('data-cell-row');
        const rowPosition = sequencerState.map(function(row) { return row.dataRowNumber; }).indexOf(cellRowNumber);
        // console.log("Row position", rowPosition);
        const dataCellNumber = parseInt(e.target.getAttribute('data-cell-number'));
        // console.log("dataCellNumber", dataCellNumber); 
        // console.log("Row", rowPosition);
        // console.log("HERE", sequencerState[rowPosition].rowDataCells);
        const cellPosition = sequencerState[rowPosition].rowDataCells.map(function(cell) { return cell.dataCellNumber; }).indexOf(dataCellNumber);
        // console.log("Cell", cellPosition);
        const stateIndexToUpdate = {...this.state.sequencerState[rowPosition].rowDataCells[cellPosition]};
        stateIndexToUpdate.dataOn = !stateIndexToUpdate.dataOn;
        this.setState({
            stateIndexToUpdate
        });


        // var currentOnState = e.target.getAttribute('data-on');
        // console.log(currentOnState);
        // if(currentOnState == 'false') {
        //     e.target.setAttribute('data-on', 'true');
        //     e.target.classList.add('on-cell');
        // }
        // else {
        //     e.target.setAttribute('data-on', 'false');
        //     e.target.classList.remove('on-cell');
        // }
    }

    render () {
        let grid = [];
        let sequencerState = this.state.sequencerState;

        // console.log('sequencerState', sequencerState);

        sequencerState.forEach(row => {
            // console.log("row", row);
            let cells = [];
            row.rowDataCells.forEach(cell => { 
                cells.push(<div onClick={this.toggleOnState} className={cell.dataOn ? 'column on-cell' : 'column'} data-cell-number={cell.dataCellNumber} data-cell-row={cell.dataCellRow} data-on={cell.dataOn} key=""></div>);
            });
            grid.push(
                <div className="grid-row" data-row-note="" key="">
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