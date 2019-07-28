import Tone from 'tone';

// Create object with intial object 'state' for DOM creation
let state = {
    playing: false,
    notes: ["C5","B4","A#4","A4","G#4","G4","F#4","F4","E4","D#4","D4","C#4","C4"],
    drumSounds: ['openhat','closedhat','snare','kick'],
    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    activeColumn: 0,
    sequencerState: [],
    drumState: [],
    bpm: 120,
    delay: false,
    synth: new Tone.PolySynth(6, Tone.Synth).toMaster()
} 

//todo - Load state from localStorage

// Augment the state on load
var notes = state.notes;
var drumSounds = state.drumSounds;
let cells = [];
let drumCells = [];
for (var i = 0; i < state.columns.length; i++) {
    let columnState = [];
    let drumColumnState = [];
    //Synth
    for (var j = 0; j < state.notes.length; j++) {
        columnState.push({
            dataCellNumber: j,
            dataCellColumn: i,
            dataOn: false,
            dataActive: false,
            note: notes[j]
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
    drumCells.push({
        dataDrumColumnNumber: i,
        columnDrumDataCells: drumColumnState
    })
};

state.sequencerState = cells;
state.drumState = drumCells;

function playSequence() {
    var seq = new Tone.Sequence((time, column) => {
        console.log(time, column);
    }, state.columns, "16n");
    seq.start(0);
}

function toggleTransport() {
    if(this.state.playing) {
        Tone.Transport.stop();
        resetActiveState();
        // this.setState({playing : false});
    }
    else {
        Tone.Transport.seconds = 0;
        Tone.Transport.bpm.value = state.bpm;
        Tone.Transport.start();
        playSequence();
        // this.setState({playing : true});
    }
}
    //     if(column === 0) {
    //         var columnIndexToChange = this.state.columns.length - 1;
    //     }
    //     else {
    //         var columnIndexToChange = column - 1;
    //     }
    //     //Synth
    //     for(var i = 0; i < this.state.notes.length; i++) {
    //         const removeActiveData = update(this.state, {
    //             sequencerState:{[columnIndexToChange]: {columnDataCells:{[i]: {dataActive: {$set: false}}}}}
    //         });
    //         this.setState(removeActiveData);
    //         const addActiveData = update(this.state, {
    //             sequencerState:{[column]: {columnDataCells:{[i]: {dataActive: {$set: true}}}}}
    //         });
    //         this.setState(addActiveData);
    //         this.setState({activeColumn: column});
    //     }
    //     var columnDataCells = this.state.sequencerState[column].columnDataCells;
    //     columnDataCells.forEach(function(cellState){
    //         if(cellState.dataOn) {  
    //             this.state.synth.triggerAttackRelease(cellState.note, '8n', '+0.1');
    //         }
    //     }.bind(this));
    //     // Drums
    //     for(var i = 0; i < this.state.drumSounds.length; i++) {
    //         const removeActiveData = update(this.state, {
    //             drumState:{[columnIndexToChange]: {columnDrumDataCells:{[i]: {dataActive: {$set: false}}}}}
    //         });
    //         this.setState(removeActiveData);
    //         const addActiveData = update(this.state, {
    //             drumState:{[column]: {columnDrumDataCells:{[i]: {dataActive: {$set: true}}}}}
    //         });
    //         this.setState(addActiveData);
    //         this.setState({activeColumn: column});
    //     }
    //     var columnDrumDataCells = this.state.drumState[column].columnDrumDataCells;
    //     columnDrumDataCells.forEach(function(cellState){

    //         if(cellState.dataOn) { 
    //             const player = new Tone.Player(`/files/${cellState.drumSound}.wav`).toMaster();
    //             player.autostart = true;
    //             Tone.Buffer.on('load', () => {
    //                 xplayer.start('+0.1');
    //             })
    //         }
    //     }.bind(this));
    // }, this.state.columns, "16n");
    // seq.start(0);
// }

// Create DOM from looping over state

// Synth
let grid = document.createElement('div');
grid.setAttribute('class', 'grid-wrapper');
state.sequencerState.forEach((synthColumn, i) => {
    var synthColumnDom = document.createElement('div'); 
    synthColumnDom.setAttribute('data-column-note', synthColumn.dataColumnNumber);
    synthColumnDom.setAttribute('class', 'grid-column drum-grid-column');
    synthColumn.columnDataCells.forEach(synthCell => { 
    let synthCellDom = document.createElement('div');
        var cellClasses = 'cell ';
        if(state.notes[synthCell.dataCellNumber].indexOf('#') > -1) {
            cellClasses+='black-note '
        }
        synthColumnDom.setAttribute('data-column-note', synthColumn.dataColumnNumber); 
        synthCellDom.setAttribute('data-cell-number', synthCell.dataCellNumber);
        synthCellDom.setAttribute('data-cell-column', synthCell.dataCellColumn);
        synthCellDom.setAttribute('data-on', synthCell.dataOn);
        synthCellDom.setAttribute('data-active', synthCell.dataActive);
        synthCellDom.setAttribute('data-cell-column', synthCell.dataCellColumn);
        synthCellDom.setAttribute('data-note', synthCell.note);
        synthCellDom.setAttribute('class', cellClasses); 
        synthColumnDom.appendChild(synthCellDom);
    });
    grid.appendChild(synthColumnDom);
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
        drumColumnDom.setAttribute('class', 'grid-column drum-grid-column');
        drumColumnDom.setAttribute('data-column-note', drumColumn.dataDrumColumnNumber); 
        drumCellDom.setAttribute('data-cell-number', drumCell.dataDrumCellNumber);
        drumCellDom.setAttribute('data-cell-column', drumCell.dataDrumCellColumn);
        drumCellDom.setAttribute('data-on', drumCell.dataOn);
        drumCellDom.setAttribute('data-active', drumCell.dataActive);
        drumCellDom.setAttribute('data-cell-column', drumCell.dataDrumCellColumn);
        drumCellDom.setAttribute('data-drum-sound', state.drumSounds[j] + '.wav');
        drumCellDom.setAttribute('class', cellClasses); 
        drumColumnDom.appendChild(drumCellDom);
    });
drumGrid.appendChild(drumColumnDom);
});

let togglePlay = document.createElement('button');
togglePlay.innerHTML = "Toggle play";
togglePlay.addEventListener('click', toggleTransport)

let sequencer = document.getElementById('sequencer');
sequencer.appendChild(grid);
sequencer.appendChild(drumGrid);
sequencer.appendChild(togglePlay);


//todo - Add toggle play button

// Sequence player logic



// // Composition Seven
// var synth = new Tone.Synth().toMaster();
// var button = document.getElementById("make-some-noise");

// //DOM
// var allCells = document.querySelectorAll('.column');

// //State
// var playing = false;

// function toggleSequence() {
//     if(playing) {
//         console.log("I was playing");
//         Tone.Transport.stop();
//         playing = false;
//     }
//     else {
//         console.log("I was not playing");
//         Tone.Transport.start();
//         console.log('sequence');
//         var seq = new Tone.Sequence(function(time, note){
//             console.log('note', note);
//             var sequenceCellNumber = Math.floor((time * 2)  % 16);
//             console.log(sequenceCellNumber);
//             for (var i = 0; i < allCells.length; ++i) {
//                 allCells[i].classList.remove('active-cell');
//             }
//             var activeCells = document.querySelectorAll(`[data-cell-number=${CSS.escape(sequenceCellNumber)}]`);
//             for (var i = 0; i < activeCells.length; ++i) {
//                 activeCells[i].classList.add('active-cell');
//                 if(activeCells[i].className.match(/\bon-cell\b/)) {
//                     var noteToPlay = activeCells[i].parentNode.getAttribute('data-row-note');
//                     synth.triggerAttackRelease(noteToPlay, '8n');
//                 }
//             }



//         //subdivisions are given as subarrays
//         }, ["C4"]).start(0);
//         playing = true;
//     }
// }

// button.addEventListener("click",function(e){
//     console.log('play');
//     toggleSequence();
// },false);

// for (var i = 0; i < allCells.length; ++i) {
//     console.log(allCells[i]);
//     allCells[i].addEventListener("click", function() {
//         var currentOnState = this.getAttribute('data-on');
//         console.log(currentOnState);
//         if(currentOnState == 'false') {
//             this.setAttribute('data-on', 'true');
//             this.classList.add('on-cell');
//         }
//         else {
//             this.setAttribute('data-on', 'false');
//             this.classList.remove('on-cell');
//         }
//     });
// }