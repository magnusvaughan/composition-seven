import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Sequencer from './Sequencer'
import SequencerRead from './SequencerRead'
import axios from 'axios';

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            "authenticated": false,
            "loaded": false
        }
        this.isUserAuthenticated = this.isUserAuthenticated.bind(this);
    }

    async componentDidMount() {
       await this.isUserAuthenticated();
       this.setState({loaded: true})
    }

    isUserAuthenticated() {
        axios.get('/songs/user/isUserAuthenticated').then(response => {
            if(response.data.authenticated == true) {
                this.setState({
                    "authenticated": true,
                    user_id: response.data.user_id
                })
            }
        })
    }

    render() {
        var activeView;
        if(this.state.authenticated) {
            activeView = (
            <BrowserRouter>
            <Switch>
                <Route exact path='/' render={(props) => <Sequencer {...props} user_id={this.state.user_id} />} />
                <Route path='/songs/:id' component={SequencerRead} />
            </Switch>
            </BrowserRouter>
            );
        }
        else {
            activeView = (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={SequencerRead} />
                    <Route path='/songs/:id' component={SequencerRead} />
                </Switch>
            </BrowserRouter>
            );
        }

        return (
            <div>
                {this.state.loaded ? activeView : (
                    <h1>Loading...</h1>
                )};
            </div>
        )
    }
}

if (document.getElementById('sequencer')) {
    ReactDOM.render(<App />, document.getElementById('sequencer'));
}
