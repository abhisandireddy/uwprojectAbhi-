import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Draggable from 'react-draggable';
import Google from './images/Google.png';
import UW from './images/UW.png';
import GLBRC from './images/GLBRC.png';
import WEI from './images/WEI.png';
import Twitter from './images/Twitter.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Input, InputGroup, Button } from 'reactstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      loginInfo: [],
      username: [],
      pass: [],
      value: "",
      password: "",
      URLS: []
    }

    this.checkAuth = this.checkAuth.bind(this);

  }


  handleChange(event) {
    this.setState({ value: event.target.value })

  }

  handleChangePass(event) {
    this.setState({ password: event.target.value })
  }


  fetchAuth() {
    return (axios.get('http://localhost:3001/authenticate').then((response) =>
      this.setState({ loginInfo: response.data }))
    )
  }

  checkAuth() {
    this.fetchAuth().then(() => {
      const username = this.state.loginInfo.map((userCombo) => {
        return (
          userCombo.Username
        )
      })
      const password = this.state.loginInfo.map((userCombo) => {
        return (
          userCombo.Password
        )
      })
      this.setState({ username: username })
      this.setState({ pass: password })

      if (this.state.username.includes(this.state.value) && this.state.pass.includes(this.state.password)) {
        this.setState({ auth: true })
        this.props.history.push("/homepage");
      }


    }).then(() => {
      axios.post("http://localhost:3001/userInfo", {
        username: this.state.value
      }).then((response) => {
        const urls = response.data.map((item) => {
          return (item.URL)
        });
        this.setState({ URLS: urls })
      }
      )
    });
  }

  render() {

    const loginScreen = (
      <div className="flexbox">
        <h1> Login </h1>
        <InputGroup style={{ width: '500px' }}>
          <Input value={this.state.value} onChange={(event) => this.handleChange(event)} placeholder="username" />
          <Input value={this.state.password} onChange={(event) => this.handleChangePass(event)} placeholder="password" />
        </InputGroup>
        <Button onClick={this.checkAuth} color="primary">Login</Button>
      </div>
    )
    
    const srcArray = (this.state.URLS.map((URL) => {
     console.log(this.state.URLS);
      {
        if (URL === "http://google.com") {
          return [Google, "Search Engine", "Google"];
        }
        if (URL === 'http://wisc.edu') {
          return [UW, "UW homepage", "UW"];
        }
        if (URL === 'http://glbrc.org') {
          return [GLBRC, "Great Lakes Bioenergy Research Center", "GLBRC"];
        }
        if (URL === 'https://energy.wisc.edu') {
          return [WEI, "Wisconsin Energy Institute", "WEI"];
        }
        if (URL === 'https://twitter.com') {
          return [Twitter, "Twitter", "Twitter"];
        }
        else {
          return ""
        }
      }
    }
    ))

    return (

      (!this.state.auth ? loginScreen : (
        <div className="flexbox">
          {this.state.URLS.map((URL,i) => {
            return (
              <Draggable>
                <a href={URL}>
                  <img style={{ width: '100px', height: '100px' }} src={srcArray[i][0]} />
                {srcArray[i][2] + ", " + srcArray[i][1]}
                </a>
              </Draggable>
            )
          })}
        </div>
      )
      )

    )
  };
}

export default withRouter(App);
