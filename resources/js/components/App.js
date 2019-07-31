import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sequencer from './Sequencer'

export default class App extends Component {
    render() {
        return (
            <div className="container">
                <Sequencer />
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
