import React, { Component } from 'react'
import Tone from 'tone';
import update from 'immutability-helper';

// Composition Seven
class Sequencer extends Component {
    constructor () {
        super()
        this.state = {
            playing: false,
            notes: ["C5","B4","A#4","A4","G#4","G4","F#4","F4","E4","D#4","D4","C#4","C4"],
            drumSounds: ['openhat','closedhat','snare','kick'],
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            activeColumn: 0,
            sequencerState: [],
            drumState: [],
            bpm: 120,
            delay: false,
            synth: new Tone.PolySynth(6, Tone.Synth).toMaster()
        }
        this.playSequence = this.playSequence.bind(this);
        this.toggleSequence = this.toggleSequence.bind(this);
        this.toggleOnState = this.toggleOnState.bind(this);
        this.toggleDrumOnState = this.toggleDrumOnState.bind(this);
        this.resetActiveState = this.resetActiveState.bind(this);
        this.changeSynthType = this.changeSynthType.bind(this);
        this.changeRelease = this.changeRelease.bind(this);
        this.changeBpm = this.changeBpm.bind(this);
        this.toggleDelay = this.toggleDelay.bind(this);
        this.loadSong = this.loadSong.bind(this);
        this.saveSong = this.saveSong.bind(this);
    }

    componentDidMount () {
        var notes = this.state.notes;
        var drumSounds = this.state.drumSounds;
        let cells = [];
        let drumCells = [];
        for (var i = 0; i < this.state.columns.length; i++) {
            let columnState = [];
            let drumColumnState = [];
            //Synth
            for (var j = 0; j < this.state.notes.length; j++) {
                columnState.push({
                    dataCellNumber: j,
                    dataCellColumn: i,
                    dataOn: false,
                    dataActive: false,
                    note: notes[j]
                });
            }
            //Drums
            for (var k = 0; k < this.state.drumSounds.length; k++) {
                drumColumnState.push({
                    dataDrumCellNumber: k,
                    dataDrumCellColumn: i,
                    dataOn: false,
                    dataActive: false,
                    drumSound: drumSounds[k]
                });
            }
            cells.push({
                dataColumnNumber: i,
                columnDataCells: columnState
            });
            drumCells.push({
                dataDrumColumnNumber: i,
                columnDrumDataCells: drumColumnState
            })
            this.setState({
                sequencerState: cells,
                drumState: drumCells
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
            //Synth
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
                    this.state.synth.triggerAttackRelease(cellState.note, '8n', '+0.05');
                }
            }.bind(this));
            // Drums
            for(var i = 0; i < this.state.drumSounds.length; i++) {
                const removeActiveData = update(this.state, {
                    drumState:{[columnIndexToChange]: {columnDrumDataCells:{[i]: {dataActive: {$set: false}}}}}
                });
                this.setState(removeActiveData);
                const addActiveData = update(this.state, {
                    drumState:{[column]: {columnDrumDataCells:{[i]: {dataActive: {$set: true}}}}}
                });
                this.setState(addActiveData);
                this.setState({activeColumn: column});
            }
            var columnDrumDataCells = this.state.drumState[column].columnDrumDataCells;
            columnDrumDataCells.forEach(function(cellState){

                if(cellState.dataOn) { 
                    const player = new Tone.Player(`/files/${cellState.drumSound}.wav`).toMaster();
                    player.autostart = true;
                    Tone.Buffer.on('load', () => {
                        xplayer.start();
                    })
                }
            }.bind(this));
        }, this.state.columns, "16n");
        seq.start(0);
    }

    resetActiveState() {
        var column = this.state.activeColumn;
        let copiedState = this.state;
        for(var j = 0; j < this.state.notes.length; j++) {
            copiedState.sequencerState[column].columnDataCells[j].dataActive = false;
        }
        for(var k = 0; k < this.state.drumSounds.length; k++) {
            copiedState.drumState[column].columnDrumDataCells[k].dataActive = false;
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

    toggleDrumOnState(e) {
        const drumState = this.state.drumState;
        const cellDrumColNumber = e.target.getAttribute('data-cell-column');
        const dataDrumCellNumber = parseInt(e.target.getAttribute('data-cell-number'));
        const cellPosition = drumState[cellDrumColNumber].columnDrumDataCells[dataDrumCellNumber];
        const newData = update(this.state, {
            drumState:{[cellDrumColNumber]: {columnDrumDataCells:{[dataDrumCellNumber]: {dataOn: {$set: !drumState[cellDrumColNumber].columnDrumDataCells[dataDrumCellNumber].dataOn}}}}}
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
            case 'Poly':
                this.setState({synth: new Tone.PolySynth(6, Tone.Synth).toMaster()});
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
                this.setState({synth: new Tone.PolySynth(6, Tone.Synth).toMaster()});
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

    toggleDelay() {
        if(!this.state.delay) {
            var synth = this.state.synth;
            var split = synth.split('.toMaster()})');
        }
    }

    loadSong() {
        var drumState = JSON.parse(localStorage.getItem('drumState'));
        var synthState = JSON.parse(localStorage.getItem('synthState'));
        this.setState({
            drumState: drumState,
            sequencerState: synthState
        });
    }

    saveSong() {
        var drumStateString = JSON.stringify(this.state.drumState);
        var synthStateString = JSON.stringify(this.state.sequencerState);
        localStorage.setItem('drumState', drumStateString);
        localStorage.setItem('synthState', synthStateString);
    }

    render () {
        // Synth
        let grid = [];
        let sequencerState = this.state.sequencerState;
        let notes = this.state.notes;
        sequencerState.forEach((column, i) => {
            let cells = [];
            column.columnDataCells.forEach(cell => { 
                var cellClasses = 'cell ';
                if(notes[cell.dataCellNumber].indexOf('#') > -1) {
                    cellClasses+='black-note '
                }
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

        // Drums
        let drumGrid = [];
        let drumState = this.state.drumState;
        let drumSounds = this.state.drumSounds;
        drumState.forEach((column, i) => {
            let drumCells = [];
            column.columnDrumDataCells.forEach(cell => { 
                var cellClasses = 'cell ';
                if(cell.dataOn) {
                    cellClasses+='on-cell ';
                }
                if(cell.dataActive) {
                    cellClasses+='active-cell'
                }
                drumCells.push(
                    <div onClick={this.toggleDrumOnState} 
                        className={cellClasses} 
                        data-cell-number={cell.dataDrumCellNumber} 
                        data-cell-column={cell.dataDrumCellColumn} 
                        data-on={cell.dataOn} 
                        data-active={cell.dataActive} 
                        key={i + parseInt(cell.dataCellNumber)}>
                    </div>
                );
            });
            drumGrid.push(
                <div className="grid-column drum-grid-column" data-column-note={column.dataColumnNumber} key={column.dataColumnNumber}>
                    {drumCells}
                </div>
            )


        });

        var buttonLabel = this.state.playing ? 'stop' : 'noise';
        
        return (
            <div className="content">
                <div>
                    <button onClick={this.loadSong}>Load</button>
                    <button onClick={this.saveSong}>Save</button>
                    <select id="lang" onChange={this.changeSynthType} value={this.state.type}>
                        <option value="Poly">Polysynth</option>
                        <option value="Monosynth">Monosynth</option>
                        <option value="FM">FM</option>
                        <option value="Pluck">Pluck</option>
                        <option value="Metal">Metal</option>
                    </select>
                    <p></p>
                    <p>{this.state.value}</p>
                </div>
                <div className="button-wrapper">
                    <button onClick={this.toggleSequence} id="make-some-noise" className="btn btn-1 btn-1e">{buttonLabel}</button>
                </div>
                <label htmlFor="bpm">BPM - {this.state.bpm}</label>
                <input onChange={this.changeBpm} type="range" min="0" max="180" value={this.state.bpm} step="1" className="slider" id="bpm" />
                <div className="grid-wrapper">
                    {grid}
                </div>
                <div className="grid-wrapper">
                    {drumGrid}
                </div>
            </div>
        )
    }
}

export default Sequencer