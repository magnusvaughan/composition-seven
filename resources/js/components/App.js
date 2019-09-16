import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sequencer from './Sequencer'
import SequencerRead from './SequencerRead'
import axios from 'axios';

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            "authenticated": false
        }
        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
    }

    componentDidMount() {
        this.isUserAuthenticated();
    }

    isUserAuthenticated() {
        axios.get('/songs/user/isUserAuthenticated').then(response => {
            if(response.data == true) {
                this.setState({
                    "authenticated": true
                })
            }
        })
    }

    render() {
        var activeView;
        if(this.state.authenticated) {
            activeView = (
                <div>
                <Sequencer />
                </div>
            );
        }
        else {
            activeView = (
                <div>
                <SequencerRead />
                </div>
            );
        }

        return activeView;
    }
}

if (document.getElementById('sequencer')) {
    ReactDOM.render(<App />, document.getElementById('sequencer'));
}
