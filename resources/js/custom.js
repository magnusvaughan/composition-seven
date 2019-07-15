import Tone from 'tone';

// Composition Seven
var synth = new Tone.Synth().toMaster();
var button = document.getElementById("make-some-noise");

//State
var playing = false;

function toggleSequence() {
    if(playing) {
        console.log("it was playing");
        Tone.Transport.stop();
        playing = false;
    }
    else {
        console.log("It was not playing");
        Tone.Transport.clear();
        Tone.Transport.start();
        console.log('sequence');
        var seq = new Tone.Sequence(function(time, note){
            var sequenceCell = Math.floor(time % 16);
            console.log(sequenceCell);
            var allCells = document.querySelectorAll('.column');
            for (var i = 0; i < allCells.length; ++i) {
                allCells[i].classList.remove('active-cell');
             }

            var activeCell = document.querySelector(`[data-cell-number=${CSS.escape(sequenceCell)}]`);
            activeCell.classList.add('active-cell');
            console.log(activeCell);

            synth.triggerAttackRelease(note, '16n');
        //subdivisions are given as subarrays
        }, ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]]).start(0);
        playing = true;
    }
}

button.addEventListener("click",function(e){
    console.log('play');
    toggleSequence();
},false);