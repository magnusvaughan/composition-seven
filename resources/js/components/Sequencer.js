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
            notes: ["C4","D4","E4","F4","G4","A4","B4","C5"]
        }
    }

    componentDidMount () {

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
            console.log('sequence');
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
            }, ["C4"]).start(0);
            playing = true;
        }
    }

    toggleOnState(e) {
        var currentOnState = e.target.getAttribute('data-on');
        console.log(currentOnState);
        if(currentOnState == 'false') {
            e.target.setAttribute('data-on', 'true');
            e.target.classList.add('on-cell');
        }
        else {
            e.target.setAttribute('data-on', 'false');
            e.target.classList.remove('on-cell');
        }
    }

    render () {
        let grid = [];

        for (var i=0; i<=this.state.notes.length; i++) {
            let cells = [];
            for (let j = 0; j < 15; j++) {
            cells.push(<div onClick={this.toggleOnState} className="column" data-cell-number={j} data-on="false" key={i+j}></div>);
            }
            grid.push(
                <div className="grid-row" data-row-note={this.state.notes[i]} key={this.state.notes[i]}>
                    {cells}
                </div>
            )
        }
        
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