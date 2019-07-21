import React, { Component } from 'react'
import Tone from 'tone';
import update from 'immutability-helper';

// Composition Seven
class Sequencer extends Component {
    constructor () {
        super()
        this.state = {
            playing: false,
            notes: ["C4","B3","A3","G3","F3","E3","D3","C3"],
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            activeColumn: 0,
            sequencerState: [],
            synth: {}
        }
        this.playSequence = this.playSequence.bind(this);
        this.toggleSequence = this.toggleSequence.bind(this);
        this.toggleOnState = this.toggleOnState.bind(this);
        this.resetActiveState = this.resetActiveState.bind(this);
    }

    componentDidMount () {

        this.setState({synth : new Tone.MonoSynth({
            "oscillator" : {
                "type" : "square"
         },
         "envelope" : {
             "attack" : 0.1
         }
        }).toMaster()});

        let cells = [];
        for (var i = 0; i < this.state.columns.length; i++) {
            let columnState = [];
            for (var j = 0; j < this.state.notes.length; j++) {
                columnState.push({
                    dataCellNumber: j,
                    dataCellColumn: i,
                    dataOn: false,
                    dataActive: false
                });
            }
            cells.push({
                dataColumnNumber: i,
                columnDataCells: columnState
            })
            this.setState({
                sequencerState: cells
            });
        }
    }

    playSequence() {
        var notes = this.state.notes;
    
        var seq = new Tone.Sequence((time, column) => {
            if(column === 0) {
                var columnIndexToChange = this.state.columns.length - 1;
            }
            else {
                var columnIndexToChange = column - 1;
            }
            for(var i = 0; i < this.state.notes.length; i++) {
                const removeActiveData = update(this.state, {
                    sequencerState:{[columnIndexToChange]: {columnDataCells:{[i]: {dataActive: {$set: false}}}}}
                });
                this.setState(removeActiveData);
                const addActiveData = update(this.state, {
                    sequencerState:{[column]: {columnDataCells:{[i]: {dataActive: {$set: true}}}}}
                });
                this.setState(addActiveData);
                this.setState({activeColumn: column});
            }
            var columnDataCells = this.state.sequencerState[column].columnDataCells;
            columnDataCells.forEach(function(cellState){
                if(cellState.dataOn) {
                    var noteToPlay = notes[cellState.dataCellNumber];
                    this.state.synth.triggerAttackRelease(noteToPlay, '8n');
                }
            }.bind(this));
        }, this.state.columns);
        seq.start(0);
    }

    resetActiveState() {
        var column = this.state.activeColumn;
        let copiedState = this.state;
        for(var j = 0; j < this.state.notes.length; j++) {
            copiedState.sequencerState[column].columnDataCells[j].dataActive = false;
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
            Tone.Transport.bpm.value = 120;
            Tone.Transport.start();
            this.playSequence();
            this.setState({playing : true});
        }
    }

    toggleOnState(e) {
        const sequencerState = this.state.sequencerState;
        const cellColNumber = e.target.getAttribute('data-cell-column');
        const dataCellNumber = parseInt(e.target.getAttribute('data-cell-number'));
        const cellPosition = sequencerState[cellColNumber].columnDataCells[dataCellNumber];
        const newData = update(this.state, {
            sequencerState:{[cellColNumber]: {columnDataCells:{[dataCellNumber]: {dataOn: {$set: !sequencerState[cellColNumber].columnDataCells[dataCellNumber].dataOn}}}}}
        });
        this.setState(newData);
    }

    render () {
        let grid = [];
        let sequencerState = this.state.sequencerState;
        sequencerState.forEach((column, i) => {
            let cells = [];
            column.columnDataCells.forEach(cell => { 
                var cellClasses = 'cell ';
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
                        data-cell-column={cell.dataCellColumn} 
                        data-on={cell.dataOn} 
                        data-active={cell.dataActive} 
                        key={i + parseInt(cell.dataCellNumber)}>
                    </div>
                );
            });
            grid.push(
                <div className="grid-column" data-column-note={column.dataColumnNumber} key={column.dataColumnNumber}>
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