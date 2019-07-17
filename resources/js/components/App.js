import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Sequencer from './Sequencer'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div>
            <Switch>
                <Route exact path='/' component={Sequencer} />
            </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))