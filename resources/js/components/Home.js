import React from "react";
import axios from "axios";
import Sequencer from "./Sequencer";

export default class Home extends React.Component {
  constructor(props) {
      console.log("Redirect working to home page");
      console.log("path name: " + this.props.location.pathname);
    super(props);
    
    this.state = {
      token: JSON.parse(localStorage["appState"]).user.auth_token,
      users: []
    };
  }

  componentDidMount() {
      console.log('home component');
    axios
      .get(`http://composition-seven.test/api/users/list?token=${this.state.token}`)
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if (json.data.success) {
          this.setState({ users: json.data.data });
          //alert("Login Successful!");
        } else alert("Login Failed!");
      })
      .catch(error => {
        alert(`An Error Occured! ${error}`);
      });
  }

  render() {
    return (
      <div>
        <Sequencer/ >
      </div>
    );
  }
}