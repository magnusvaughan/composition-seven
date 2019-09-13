import React from 'react'
import ReactDOM from 'react-dom'
import {  BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Index from './index'
import Login from './login'
import Register from './register'
import Home from './home'
import Forgot from './forgot'
import Reset from './reset'


ReactDOM.render(
	<Router>
	    <Switch>
	    <Route exact path='/' component={Index}/>
	    <Route path='/login' component={Login}/>
	    <Route path='/register' component={Register}/>
	    <Route path='/home' component={Home}/>
	    <Route path='/forgotpassword' component={Forgot}/>
	    <Route path='/password/reset/:token' component={Reset}/>
	</Switch>
	</Router>,
    document.getElementById('app')
);