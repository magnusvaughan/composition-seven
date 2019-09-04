import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sequencer from './Sequencer'

export default class App extends Component {
    render() {
        return (
            <div>
            <Sequencer />
            </div>
        );
    }
}

if (document.getElementById('sequencer')) {
    ReactDOM.render(<App />, document.getElementById('sequencer'));
}
