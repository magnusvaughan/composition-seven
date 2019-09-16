import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sequencer from './Sequencer'
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
        axios.get('/songs/user/checkAuth').then(response => {
            if(response.data == true) {
                this.setState({
                    "authenticated": true
                })
            }
        })
    }

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
