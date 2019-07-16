import Tone from 'tone';

// Composition Seven
var synth = new Tone.Synth().toMaster();
var button = document.getElementById("make-some-noise");

//DOM
var allCells = document.querySelectorAll('.column');

//State
var playing = false;

function toggleSequence() {
    if(playing) {
        console.log("I was playing");
        Tone.Transport.stop();
        playing = false;
    }
    else {
        console.log("I was not playing");
        Tone.Transport.start();
        console.log('sequence');
        var seq = new Tone.Sequence(function(time, note){
            var sequenceCellNumber = Math.floor((time * 2)  % 8);
            console.log(sequenceCellNumber);
            for (var i = 0; i < allCells.length; ++i) {
                allCells[i].classList.remove('active-cell');
            }
            var activeCell = document.querySelector(`[data-cell-number=${CSS.escape(sequenceCellNumber)}]`);
            activeCell.classList.add('active-cell');
            console.log(activeCell);

            synth.triggerAttackRelease(note, '8n');
        //subdivisions are given as subarrays
        }, ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]).start(0);
        playing = true;
    }
}

button.addEventListener("click",function(e){
    console.log('play');
    toggleSequence();
},false);

for (var i = 0; i < allCells.length; ++i) {
    console.log(allCells[i]);
    allCells[i].addEventListener("click", function() {
        var currentOnState = this.getAttribute('data-on');
        console.log(currentOnState);
        if(currentOnState == 'false') {
            this.setAttribute('data-on', 'true');
            this.classList.add('on-cell');
        }
        else {
            this.setAttribute('data-on', 'false');
            this.classList.remove('on-cell');
        }
    });
}