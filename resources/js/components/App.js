import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sequencer from './Sequencer'

export default class App extends Component {
    render() {
        return (
            <Sequencer />
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
