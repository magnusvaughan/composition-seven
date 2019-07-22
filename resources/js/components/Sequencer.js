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
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
            activeColumn: 0,
            sequencerState: [],
            bpm: 120,
            synth: new Tone.MonoSynth(
                {
                    "oscillator" : {
                        "type" : "square"
                 },
                 "envelope" : {
                     "attack" : 0.1
                 }
                }).toMaster()
        }
        this.playSequence = this.playSequence.bind(this);
        this.toggleSequence = this.toggleSequence.bind(this);
        this.toggleOnState = this.toggleOnState.bind(this);
        this.resetActiveState = this.resetActiveState.bind(this);
        this.changeSynthType = this.changeSynthType.bind(this);
        this.changeRelease = this.changeRelease.bind(this);
        this.changeBpm = this.changeBpm.bind(this);
    }

    componentDidMount () {

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
                    this.state.synth.triggerAttackRelease(noteToPlay, '8n', '+0.05');
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
            Tone.Transport.bpm.value = this.state.bpm;
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

    changeSynthType(e) {
        switch(event.target.value) {
            case 'Monosynth':
                this.setState({synth: new Tone.MonoSynth({
                    "oscillator" : {
                        "type" : "square"
                 },
                 "envelope" : {
                     "attack" : 0.1
                 }
                }).toMaster()});
            break;
            case 'FM':
                this.setState({
                    synth: new Tone.FMSynth().toMaster()
                });
            break;
            case 'Noise':
                this.setState({synth: new Tone.NoiseSynth().toMaster()});
              break;
            case 'Pluck':
                this.setState({
                    synth: new Tone.PluckSynth().toMaster()
                });
            break;
            case 'Noise':
                this.setState({synth: new Tone.NoiseSynth().toMaster()});
              break;
            case 'Metal':
                this.setState({synth: new Tone.MetalSynth().toMaster()});
              break;
            default:
              // code block
          }



    }

    changeRelease(e) {
        const changeRelease = update(this.state, {
            synth:{envelope: {release:{$set: parseFloat(event.target.value)}}}
        });
        this.setState(changeRelease);
    }

    changeBpm(e) {
        const changeBpm = update(this.state, {
            bpm: {$set: parseFloat(event.target.value)}
        });
        this.setState(changeBpm);
        Tone.Transport.bpm.value = this.state.bpm;
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
                <div>
                    <select id="lang" onChange={this.changeSynthType} value={this.state.type}>
                        <option value="Monosynth">Monosynth</option>
                        <option value="FM">FM</option>
                        <option value="Noise">Noise</option>
                        <option value="Pluck">Pluck</option>
                        <option value="Metal">Metal</option>
                    </select>
                    <p></p>
                    <p>{this.state.value}</p>
                </div>
                <div className="button-wrapper">
                    <button onClick={this.toggleSequence} id="make-some-noise" className="btn btn-1 btn-1e">noise</button>
                </div>
                <label htmlFor="bpm">BPM - {this.state.bpm}</label>
                <input onChange={this.changeBpm} type="range" min="0" max="400" value={this.state.bpm} step="1" className="slider" id="bpm" />
                {/* <label for="release">Release - {this.state.synth.envelope.release}</label>
                <input onChange={this.changeRelease} type="range" min="0" max="3" value={this.state.synth.envelope.release} step="0.01" className="slider" id="release" /> */}
                <div className="grid-wrapper">
                    {grid}
                </div>
            </div>
        )
    }
}

export default Sequencer