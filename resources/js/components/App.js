import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sequencer from './Sequencer'
import ModalComponent from './ModalComponent'

export default class App extends Component {
    render() {
        return (
            <div>
            <Sequencer />
            <ModalComponent /> 
            </div>
        );
    }
}

if (document.getElementById('sequencer')) {
    ReactDOM.render(<App />, document.getElementById('sequencer'));
}
