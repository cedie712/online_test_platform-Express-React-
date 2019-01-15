import React, { Component } from 'react';
import '../static/css/sign_up.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error_response:{
        has_errors: false,
        error_messages: []
      },
      redirect: false
    }
  }


  update_username(event) {
    this.setState({
        username: event.target.value
    });
  }

  update_password(event) {
    this.setState({
      password: event.target.value
    })
  }

  render_response() {
    if (this.state.error_response.has_errors) {
      let errors =  this.state.error_response.error_messages.map(messages => {
        return messages
      });
      return <div className="alert alert-danger" role="alert">{errors}</div>
    }
  }

  sign_in(event) {
    let current_state = this.state;
    let form_data = {
      username: current_state.username,
      password: current_state.password
    }
    axios.post('/api/user/sign_in', form_data)
      .then((response) => {
        console.log(response);
        if (response.data.message !== 'ok') {
          current_state.error_response.has_errors = true;
          current_state.error_response.error_messages = [response.data.message];
          this.setState(current_state);
        }
        else {
          console.log('ok');
          //save token to local storage
          localStorage.setItem('access_token', response.data.token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('username', current_state.username);
        }
      })
      .catch((error) => {
        console.log(error);
      });
      event.preventDefault();
  }

  render() {
    return (
      <div className="SignIn">
      <br/>
      <div className="container-fluid">
          <div className="row">
            <div className="col-sm-4 offset-sm-4 offset-sm-4">
              <form onSubmit={this.sign_in.bind(this)}>
                <div className="card bg-darkblue">
                  <div className="card-header text-center">
                    <h3 className="text-orange"><i className="fas fa-sign-in-alt"></i>&nbsp;User Sign In</h3>
                  </div> 
                  <div className="card-body">
                    {this.render_response()}
                    <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={event => {this.update_username(event)}} placeholder="Username" />
                    <br/>
                    <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={event => {this.update_password(event)}} placeholder="Password" />
                    <br/>
                  </div> 
                  <div className="card-footer text-right">
                    <button type="submit" className="btn btn-outline-info">Sign In</button>
                  </div>  
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;