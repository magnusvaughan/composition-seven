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
            projects: []
        }
    }

    componentDidMount () {
    // axios.get('/api/projects').then(response => {
    //     this.setState({
    //     projects: response.data
    //     })
    // })
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
                    // if(activeCells[i].className.match(/\bon-cell\b/)) {
                        var noteToPlay = activeCells[i].parentNode.getAttribute('data-row-note');
                        synth.triggerAttackRelease(noteToPlay, '8n');
                    // }
                }
            //subdivisions are given as subarrays
            }, ["C4"]).start(0);
            playing = true;
        }
    }

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

    render () {
    // const { projects } = this.state
    return (
        <div className="content">
            <div className="button-wrapper">
                <button onClick={this.toggleSequence} id="make-some-noise" className="btn btn-1 btn-1e">noise</button>
            </div>
            <div className="grid-wrapper">
                <div className="grid-row" data-row-note="C5">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
                <div className="grid-row" data-row-note="B4">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
                <div className="grid-row" data-row-note="A4">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
                <div className="grid-row" data-row-note="G4">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
                <div className="grid-row" data-row-note="F4">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
                <div className="grid-row" data-row-note="E4">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
                <div className="grid-row" data-row-note="D4">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
                <div className="grid-row" data-row-note="C4">
                    <div className="column" data-cell-number="0" data-on="false"></div>
                    <div className="column" data-cell-number="1" data-on="false"></div>
                    <div className="column" data-cell-number="2" data-on="false"></div>
                    <div className="column" data-cell-number="3" data-on="false"></div>
                    <div className="column" data-cell-number="4" data-on="false"></div>
                    <div className="column" data-cell-number="5" data-on="false"></div>
                    <div className="column" data-cell-number="6" data-on="false"></div>
                    <div className="column" data-cell-number="7" data-on="false"></div>
                    <div className="column" data-cell-number="8" data-on="false"></div>
                    <div className="column" data-cell-number="9" data-on="false"></div>
                    <div className="column" data-cell-number="10" data-on="false"></div>
                    <div className="column" data-cell-number="11" data-on="false"></div>
                    <div className="column" data-cell-number="12" data-on="false"></div>
                    <div className="column" data-cell-number="13" data-on="false"></div>
                    <div className="column" data-cell-number="14" data-on="false"></div>
                    <div className="column" data-cell-number="15" data-on="false"></div>
                </div>
            </div>
        </div>
    )
    }
}

export default Sequencer