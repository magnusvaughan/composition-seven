import React, { Component } from 'react';
import Tone from 'tone';
import update from 'immutability-helper';
import Axios from 'axios';
import ModalComponent from './ModalComponent'

// Composition Seven
class SequencerRead extends Component {
    constructor () {
        super()
        this.state = {
            playing: false,
            synthNotes: ["C5","B4","A#4","A4","G#4","G4","F#4","F4","E4","D#4","D4","C#4","C4"],
            bassNotes: ["C3","B2","A#2","A2","G#2","G2","F#2","F2","E2","D#2","D2","C#2","C2"],
            drumSounds: ['openhat','closedhat','snare','kick'],
            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            activeColumn: 0,
            songState: [],
            activeSong: "",
            synthState: [],
            bassState: [],
            drumState: [],
            bpm: 120,
            delay: false,
            synth: new Tone.PolySynth(6, Tone.FMSynth,
                {
                    "harmonicity":8,
                    "modulationIndex": 2,
                    "oscillator" : {
                        "type": "sine"
                    },
                    "envelope": {
                        "attack": 0.001,
                        "decay": 2,
                        "sustain": 0.1,
                        "release": 2
                    },
                    "modulation" : {
                        "type" : "square"
                    },
                    "modulationEnvelope" : {
                        "attack": 0.002,
                        "decay": 0.2,
                        "sustain": 0,
                        "release": 0.2
                    }
                }
            ).toMaster(),
            bassSynth: new Tone.MonoSynth(
                {
                    "portamento": 0.08,
                    "oscillator": {
                        "partials": [2, 1, 3, 2, 0.4]
                    },
                    "filter": {
                        "Q": 4,
                        "type": "lowpass",
                        "rolloff": -48
                    },
                    "envelope": {
                        "attack": 0.04,
                        "decay": 0.06,
                        "sustain": 0.4,
                        "release": 1
                    },
                    "filterEnvelope": {
                        "attack": 0.01,
                        "decay": 0.1,
                        "sustain": 0.6,
                        "release": 1.5,
                        "baseFrequency": 50,
                        "octaves": 3.4
                    }
                }).toMaster()
        }
        this.playSequence = this.playSequence.bind(this);
        this.toggleSequence = this.toggleSequence.bind(this);
        this.resetActiveState = this.resetActiveState.bind(this);
        this.loadSong = this.loadSong.bind(this);
        this.getRouteSong = this.getRouteSong.bind(this);
    }

    componentDidMount () {

        this.getRouteSong();

        var synthNotes = this.state.synthNotes;
        var bassNotes = this.state.bassNotes;
        var drumSounds = this.state.drumSounds;
        let synthCells = [];
        let bassCells = [];
        let drumCells = [];
        for (var i = 0; i < this.state.columns.length; i++) {
            let synthColumnState = [];
            let bassColumnState = [];
            let drumColumnState = [];
            //Synth
            for (var j = 0; j < this.state.synthNotes.length; j++) {
                synthColumnState.push({
                    dataSynthCellNumber: j,
                    dataSynthCellColumn: i,
                    dataOn: false,
                    note: synthNotes[j]
                });
            }
            //Bass
            for (var k = 0; k < this.state.bassNotes.length; k++) {
                bassColumnState.push({
                    dataBassCellNumber: k,
                    dataBassCellColumn: i,
                    dataOn: false,
                    note: bassNotes[k]
                });
            }
            //Drums
            for (var l = 0; l < this.state.drumSounds.length; l++) {
                drumColumnState.push({
                    dataDrumCellNumber: l,
                    dataDrumCellColumn: i,
                    dataOn: false,
                    drumSound: drumSounds[l]
                });
            }
            synthCells.push({
                dataSynthColumnNumber: i,
                columnSynthDataCells: synthColumnState
            });
            bassCells.push({
                dataBassColumnNumber: i,
                columnBassDataCells: bassColumnState
            });
            drumCells.push({
                dataDrumColumnNumber: i,
                columnDrumDataCells: drumColumnState
            })
            this.setState({
                synthState: synthCells,
                bassState: bassCells,
                drumState: drumCells
            });
        }
    }

    getRouteSong() {
        console.log('getRouteSong');
        const songId = this.props.match.params.id
        console.log(songId);
        axios.get(`/songs/show/${songId}`).then(response => {
            console.log(response);
            this.setState({
                songState: [response.data[0]],
                activeSong: response.data[0].id
            });
            var songState = JSON.parse(response.data[0].songJson);
            this.setState({
                synthState: songState.synthState,
                bassState: songState.bassState,
                drumState: songState.drumState,
            });
          })

    }

    getUserSongs() {
        axios.get('/songs/user/'+this.state.user_id).then(response => {
            console.log(response);
            this.setState({
                songState: response.data,
                activeSong: response.data[0].id
            });
            var songState = JSON.parse(response.data[0].songJson);
            this.setState({
                synthState: songState.synthState,
                bassState: songState.bassState,
                drumState: songState.drumState,
            });
        })
    }

    playSequence() {

        let kick_player = new Tone.Player({
            "url": `/files/kick.wav`,
            "autostart": false
        }).toMaster(); 

        let snare_player = new Tone.Player({
            "url": `/files/snare.wav`,
            "autostart": false
        }).toMaster(); 

        let closedhat_player = new Tone.Player({
            "url": `/files/closedhat.wav`,
            "autostart": false
        }).toMaster(); 

        let openhat_player = new Tone.Player({
            "url": `/files/openhat.wav`,
            "autostart": false
        }).toMaster(); 

        Tone.immediate();
        let allCells = document.getElementsByClassName('cell');
        var seq = new Tone.Sequence((time, column) => {
            for (var i = 0; i < allCells.length; i++) {
                allCells[i].classList.remove('active-cell');
            }
            let activeCells = document.querySelectorAll(`[data-cell-column=${CSS.escape(column)}]`);
            //All instrument active states
            for (var j = 0; j < activeCells.length; j++) {
                activeCells[j].classList.add('active-cell');
                if(activeCells[j].getAttribute('data-on') === 'true') {
                    if(activeCells[j].getAttribute('data-note') !== null) {
                        if(activeCells[j].getAttribute('data-type') == 'synth') {
                            state.synth.triggerAttackRelease(activeCells[j].getAttribute('data-note'), '8n', '+0.05');
                        }
                        if(activeCells[j].getAttribute('data-type') == 'bass') {
                            state.bassSynth.triggerAttackRelease(activeCells[j].getAttribute('data-note'), '8n', '+0.05');
                        }
                    }
                    if(activeCells[j].getAttribute('data-drum-sound') !== null) {
                        `${activeCells[j].getAttribute('data-drum-sound')}_player.start(0)`;
                    }
                }
            }
            //Synth
            var columnSynthDataCells = this.state.synthState[column].columnSynthDataCells;
            columnSynthDataCells.forEach(function(cellState){
                if(cellState.dataOn) {  
                    this.state.synth.triggerAttackRelease(cellState.note, '8n', '+0.1');
                }
            }.bind(this));
            //Bass
            var columnBassDataCells = this.state.bassState[column].columnBassDataCells;
            columnBassDataCells.forEach(function(cellState){
                if(cellState.dataOn) {  
                    this.state.synth.triggerAttackRelease(cellState.note, '8n', '+0.1');
                }
            }.bind(this));
            // Drums
            var columnDrumDataCells = this.state.drumState[column].columnDrumDataCells;
            columnDrumDataCells.forEach(function(cellState){
                if(cellState.dataOn) { 
                    const player = new Tone.Player(`/files/${cellState.drumSound}.wav`).toMaster();
                    player.autostart = true;
                    Tone.Buffer.on('load', () => {
                        xplayer.start('+0.1');
                    })
                }
            }.bind(this));
        }, this.state.columns, "16n");
        seq.start(0);
    }

    resetActiveState() {
        let allCells = document.getElementsByClassName('cell');
        for (var i = 0; i < allCells.length; i++) {
            allCells[i].classList.remove('active-cell');
        }
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

    changeSong(e) {
        let {name, value} = e.target;
        axios.get('/songs/' + value).then(response => {
            var songState = JSON.parse(response.data[0].songJson);
            this.setState({
                activeSong: value
            }) 
            this.setState({
                synthState: songState.synthState,
                bassState: songState.bassState,
                drumState: songState.drumState,
            });
        })
    }

    loadSong() {
        var songState = JSON.parse(localStorage.getItem('songStateStringObject'));
        this.setState({
            synthState: JSON.parse(songState.synth),
            bassState: JSON.parse(songState.bass),
            drumState: JSON.parse(songState.drums),
        });
    }


    render () {

        // Song menu
        let songList = this.state.songState;
        console.log(this.state.songState);
        let songOptions = [];
        songList.forEach((song) => {
            songOptions.push(<option value={song.id}>{song.name}</option>);
        });
        let songSelect = (
            <select id="song" onChange={this.changeSong} value={this.state.activeSong}>
                {songOptions}
            </select>
        );

        // Synth
        let synthGrid = [];
        let synthState = this.state.synthState;
        let synthNotes = this.state.synthNotes;
        synthState.forEach((column, i) => {
            let cells = [];
            column.columnSynthDataCells.forEach(cell => { 
                var cellClasses = 'cell ';
                if(synthNotes[cell.dataSynthCellNumber].indexOf('#') > -1) {
                    cellClasses+='black-note '
                }
                if(cell.dataOn) {
                    cellClasses+='on-cell ';
                }
                if(cell.dataActive) {
                    cellClasses+='active-cell'
                }
                cells.push(
                    <div onClick={this.toggleSynthOnState} 
                        className={cellClasses} 
                        data-cell-number={cell.dataSynthCellNumber} 
                        data-cell-column={cell.dataSynthCellColumn} 
                        data-on={cell.dataOn} 
                        data-type="bass"
                        key={cell.dataSynthCellNumber}>
                    </div>
                );
            });
            synthGrid.push(
                <div className="grid-column" data-column-note={column.dataSynthColumnNumber} key={column.dataSynthColumnNumber}>
                    {cells}
                </div>
            )
        });

        // Bass
        let bassGrid = [];
        let bassState = this.state.bassState;
        let bassNotes = this.state.bassNotes;
        bassState.forEach((column, i) => {
            let cells = [];
            column.columnBassDataCells.forEach(cell => { 
                var cellClasses = 'cell ';
                if(bassNotes[cell.dataBassCellNumber].indexOf('#') > -1) {
                    cellClasses+='black-note '
                }
                if(cell.dataOn) {
                    cellClasses+='on-cell ';
                }
                if(cell.dataActive) {
                    cellClasses+='active-cell'
                }
                cells.push(
                    <div onClick={this.toggleBassOnState} 
                        className={cellClasses} 
                        data-cell-number={cell.dataBassCellNumber} 
                        data-cell-column={cell.dataBassCellColumn} 
                        data-on={cell.dataOn}
                        data-type="bass" 
                        key={cell.dataBassCellNumber}>
                    </div>
                );
            });
            bassGrid.push(
                <div className="grid-column" data-column-note={column.dataBassColumnNumber} key={column.dataBassColumnNumber}>
                    {cells}
                </div>
            )
        });

        // Drums
        let drumGrid = [];
        let drumState = this.state.drumState;
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
                        data-type="drums"
                        key={cell.dataCellNumber}>
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
                <div className="control-wrapper">
                    <div className="button-wrapper">
                        <button onClick={this.toggleSequence} id="make-some-noise" className="btn-sequencer btn-1 btn-1e">{buttonLabel}</button>
                    </div>
                </div>
                <div className="main-grid-wrapper">
                    <div className="grid-wrapper">
                        {synthGrid}
                    </div>
                    <div className="grid-wrapper">
                        {bassGrid}
                    </div>
                    <div className="grid-wrapper">
                        {drumGrid}
                    </div>
                </div>
            </div>
        )
    }
}

export default SequencerRead
