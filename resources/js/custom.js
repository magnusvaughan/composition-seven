import Tone from 'tone';

// Create object with intial object 'state' for DOM creation
let state = {
    playing: false,
    synthNotes: ["C5","B4","A#4","A4","G#4","G4","F#4","F4","E4","D#4","D4","C#4","C4"],
    bassNotes: ["C3","B2","A#2","A2","G#2","G2","F#2","F2","E2","D#2","D2","C#2","C2"],
    drumSounds: ['openhat','closedhat','snare','kick'],
    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    activeColumn: 0,
    sequencerState: [],
    bassState: [],
    drumState: [],
    bpm: 120,
    delay: false,
    synth: new Tone.PolySynth(6, Tone.Synth).toMaster()
} 

//todo - Load state from localStorage

function loadState() {
    // Augment the state on load
    var synthNotes = state.synthNotes;
    var bassNotes = state.bassNotes;
    var drumSounds = state.drumSounds;
    let cells = [];
    let bassCells = [];
    let drumCells = [];
    for (var i = 0; i < state.columns.length; i++) {
        let columnState = [];
        let bassColumnState = [];
        let drumColumnState = [];
        //Synth
        for (var j = 0; j < state.synthNotes.length; j++) {
            columnState.push({
                dataCellNumber: j,
                dataCellColumn: i,
                dataOn: false,
                dataActive: false,
                note: synthNotes[j]
            });
        }
        //Bass
        for (var j = 0; j < state.bassNotes.length; j++) {
            bassColumnState.push({
                dataBassCellNumber: j,
                dataBassCellColumn: i,
                dataOn: false,
                dataActive: false,
                note: bassNotes[j]
            });
        }
        //Drums
        for (var k = 0; k < state.drumSounds.length; k++) {
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
        bassCells.push({
            dataColumnNumber: i,
            columnBassDataCells: bassColumnState
        });
        drumCells.push({
            dataDrumColumnNumber: i,
            columnDrumDataCells: drumColumnState
        })
    };
    state.sequencerState = cells;
    state.bassState = bassCells;
    state.drumState = drumCells;
}

function playSequence() {
    let allCells = document.getElementsByClassName('cell');
    var seq = new Tone.Sequence((time, column) => {

        for (var i = 0; i < allCells.length; i++) {
            allCells[i].classList.remove('active-cell');
        }

        let activeCells = document.querySelectorAll(`[data-cell-column=${CSS.escape(column)}]`);

        for (var j = 0; j < activeCells.length; j++) {
            activeCells[j].classList.add('active-cell');
            if(activeCells[j].getAttribute('data-on') === 'true') {
                if(activeCells[j].getAttribute('data-note') !== null) {
                    state.synth.triggerAttackRelease(activeCells[j].getAttribute('data-note'), '8n', '+0.1');
                }
                if(activeCells[j].getAttribute('data-drum-sound') !== null) {
                    const player = new Tone.Player(`/files/${activeCells[j].getAttribute('data-drum-sound')}.wav`).toMaster();
                    player.autostart = true;
                    Tone.Buffer.on('load', () => {
                        xplayer.start('+0.1');
                    })
                }
            }
        }

    }, state.columns, "16n");
    seq.start(0);
}

function resetActiveState() {
    let allCells = document.getElementsByClassName('cell');
    for (var i = 0; i < allCells.length; i++) {
        allCells[i].classList.remove('active-cell');
    }
}

function toggleTransport() {
    var transportToggleButton = document.getElementById('toggleTransport');
    if(state.playing) {
        transportToggleButton.innerHTML = 'Play'
        Tone.Transport.stop();
        resetActiveState();
        state.playing = false;
    }
    else {
        transportToggleButton.innerHTML = 'Stop'
        Tone.Transport.seconds = 0;
        Tone.Transport.bpm.value = state.bpm;
        Tone.Transport.start();
        playSequence();
        state.playing = true;
    }
}

function toggleCellOn(e, instrument) {

    const cell = e.target;
    const onState = cell.getAttribute('data-on');
    const cellColumn = cell.getAttribute('data-cell-column');
    const cellNumber = cell.getAttribute('data-cell-number');

    if(onState === 'true') {
        cell.classList.remove('on-cell');
        cell.setAttribute('data-on', "false");
        switch(instrument) {
            case 'synth':
                state.sequencerState[cellColumn].columnDataCells[cellNumber].dataOn = false;
              break;
            case 'bass':
                state.bassState[cellColumn].columnBassDataCells[cellNumber].dataOn = false;
              break;
            case 'sampler':
                state.drumState[cellColumn].columnDrumDataCells[cellNumber].dataOn = false;
              break;
            default:
                state.sequencerState[cellColumn].columnDataCells[cellNumber].dataOn = false;
          }
    }
    else {
        cell.classList.add('on-cell');
        cell.setAttribute('data-on', "true");
        switch(instrument) {
            case 'synth':
                state.sequencerState[cellColumn].columnDataCells[cellNumber].dataOn = true;
              break;
            case 'bass':
                state.bassState[cellColumn].columnBassDataCells[cellNumber].dataOn = true;
              break;
            case 'sampler':
                state.drumState[cellColumn].columnDrumDataCells[cellNumber].dataOn = true;
              break;
            default:
                state.sequencerState[cellColumn].columnDataCells[cellNumber].dataOn = true;
          }
    }
}

function loadSong() {
    var synthState = JSON.parse(localStorage.getItem('synthState'));
    var bassState = JSON.parse(localStorage.getItem('bassState'));
    var drumState = JSON.parse(localStorage.getItem('drumState'));
    state.sequencerState = synthState;
    state.bassState = bassState;
    state.drumState = drumState;
    renderState();
}

function saveSong() {
    var synthStateString = JSON.stringify(state.sequencerState);
    var bassStateString = JSON.stringify(state.bassState);
    var drumStateString = JSON.stringify(state.drumState);
    localStorage.setItem('synthState', synthStateString);
    localStorage.setItem('bassState', bassStateString);
    localStorage.setItem('drumState', drumStateString);
}

// Create DOM from looping over state

function renderState() {

    let sequencer = document.getElementById('sequencer');
    sequencer.innerHTML = '';

    let content = document.createElement('div');
    content.setAttribute('class', 'content');
    
    // Synth
    let grid = document.createElement('div');
    grid.setAttribute('class', 'grid-wrapper');
    state.sequencerState.forEach((synthColumn, i) => {
        var synthColumnDom = document.createElement('div'); 
        synthColumnDom.setAttribute('data-column-note', synthColumn.dataColumnNumber);
        synthColumnDom.setAttribute('class', 'grid-column drum-grid-column');
        synthColumn.columnDataCells.forEach((synthCell, j) => { 

            let synthCellDom = document.createElement('div');
            var cellClasses = 'cell ';
            if(state.sequencerState[i].columnDataCells[j].note.indexOf('#') > -1) {
                cellClasses+='black-note '
            }
            if(state.sequencerState[i].columnDataCells[j].dataOn) {
                cellClasses+='on-cell';
            }
            synthColumnDom.setAttribute('data-column-note', synthColumn.dataColumnNumber); 
            synthCellDom.setAttribute('data-cell-number', synthCell.dataCellNumber);
            synthCellDom.setAttribute('data-cell-column', synthCell.dataCellColumn);
            synthCellDom.setAttribute('data-on', synthCell.dataOn);
            synthCellDom.setAttribute('data-active', synthCell.dataActive);
            synthCellDom.setAttribute('data-cell-column', synthCell.dataCellColumn);
            synthCellDom.setAttribute('data-note', synthCell.note);
            synthCellDom.setAttribute('class', cellClasses); 
            synthCellDom.addEventListener("click", function(e){
                toggleCellOn(e, "synth");
            }, false);
            synthColumnDom.appendChild(synthCellDom);

        });
        grid.appendChild(synthColumnDom);
    });

    // Bass
    let bassGrid = document.createElement('div');
    bassGrid.setAttribute('class', 'grid-wrapper');
    state.bassState.forEach((bassColumn, i) => {
        var bassColumnDom = document.createElement('div'); 
        bassColumnDom.setAttribute('data-column-note', bassColumn.dataBassColumnNumber);
        bassColumnDom.setAttribute('class', 'grid-column drum-grid-column');
        bassColumn.columnBassDataCells.forEach((bassCell, j) => { 

            let bassCellDom = document.createElement('div');
            var bassCellClasses = 'cell ';
            if(state.bassState[i].columnBassDataCells[j].note.indexOf('#') > -1) {
                bassCellClasses+='black-note '
            }
            if(state.bassState[i].columnBassDataCells[j].dataOn) {
                bassCellClasses+='on-cell';
            }
            bassColumnDom.setAttribute('data-column-note', bassColumn.dataColumnNumber); 
            bassCellDom.setAttribute('data-cell-number', bassCell.dataBassCellNumber);
            bassCellDom.setAttribute('data-cell-column', bassCell.dataBassCellColumn);
            bassCellDom.setAttribute('data-on', bassCell.dataOn);
            bassCellDom.setAttribute('data-active', bassCell.dataActive);
            bassCellDom.setAttribute('data-cell-column', bassCell.dataBassCellColumn);
            bassCellDom.setAttribute('data-note', bassCell.note);
            bassCellDom.setAttribute('class', bassCellClasses); 
            bassCellDom.addEventListener("click", function(e){
                toggleCellOn(e, "bass");
            }, false);
            bassColumnDom.appendChild(bassCellDom);

        });
        bassGrid.appendChild(bassColumnDom);
    });
    
    // Drums
    let drumGrid = document.createElement('div');  
    drumGrid.setAttribute('class', 'grid-wrapper');
    state.drumState.forEach((drumColumn, i) => {
    var drumColumnDom = document.createElement('div'); 
    drumColumnDom.setAttribute('data-column-note', drumColumn.dataDrumColumnNumber);
    drumColumnDom.setAttribute('class', 'grid-column drum-grid-column');
    drumColumn.columnDrumDataCells.forEach((drumCell, j) => { 
            let drumCellDom = document.createElement('div');
            var cellClasses = 'cell ';
            if(state.drumState[i].columnDrumDataCells[j].dataOn) {
                cellClasses+='on-cell';
            }
            drumColumnDom.setAttribute('class', 'grid-column drum-grid-column');
            drumColumnDom.setAttribute('data-column-note', drumColumn.dataDrumColumnNumber); 
            drumCellDom.setAttribute('data-cell-number', drumCell.dataDrumCellNumber);
            drumCellDom.setAttribute('data-cell-column', drumCell.dataDrumCellColumn);
            drumCellDom.setAttribute('data-on', drumCell.dataOn);
            drumCellDom.setAttribute('data-active', drumCell.dataActive);
            drumCellDom.setAttribute('data-cell-column', drumCell.dataDrumCellColumn);
            drumCellDom.setAttribute('data-drum-sound', state.drumSounds[j]);
            drumCellDom.setAttribute('class', cellClasses);
            drumCellDom.addEventListener("click", function(e){
                toggleCellOn(e, "sampler");
            }, false); 
            drumColumnDom.appendChild(drumCellDom);
        });
    drumGrid.appendChild(drumColumnDom);
    });
    
    let togglePlay = document.createElement('button');
    togglePlay.innerHTML = "Play";
    togglePlay.setAttribute('id', 'toggleTransport'); 
    togglePlay.addEventListener('click', toggleTransport);
    
    let saveSongDom = document.createElement('button');
    saveSongDom.innerHTML = "Save";
    saveSongDom.setAttribute('id', 'saveSong'); 
    saveSongDom.addEventListener('click', saveSong);
    
    let loadSongDom = document.createElement('button');
    loadSongDom.innerHTML = "Load";
    loadSongDom.setAttribute('id', 'loadSong'); 
    loadSongDom.addEventListener('click', loadSong);
    
    sequencer.appendChild(content);
    content.appendChild(grid);
    content.appendChild(bassGrid);
    content.appendChild(drumGrid);
    content.appendChild(togglePlay);
    content.appendChild(loadSongDom);
    content.appendChild(saveSongDom);
}

loadState();
renderState();