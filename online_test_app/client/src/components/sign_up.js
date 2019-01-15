import React, { Component } from 'react';
import '../static/css/sign_up.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
        username: '',
        email: '',
        user_type: 'test taker',
        password: '',
        confirm: '',
        error_response:{
          has_errors: false,
          error_messages: []
        },
        redirect: false
    }
  }

  static defaultProps = {
    user_types: ['test maker', 'test taker'],
  }

  update_username(event) {
    this.setState({
        username: event.target.value
    });
  }

  update_email(event) {
    this.setState({
        email: event.target.value
    });
  }

  update_user_type(event) {
    this.setState({
      user_type: event.target.value
    });
  }

  update_password(event) {
    this.setState({
      password: event.target.value
    });
  }

  update_confirm(event) {
    this.setState({
      confirm: event.target.value
    });
  }

  register(event) {
    let current_state = this.state;
    let form_data = {
      username: current_state.username,
      email: current_state.email,
      user_type: current_state.user_type,
      password: current_state.password,
      confirm: current_state.confirm
    }
    axios.post('/api/user/sign_up', form_data)
    .then((response) => {
      // console.log(response.data);
        if (response.data.message !== 'ok') {
          current_state.error_response.has_errors = true;
          current_state.error_response.error_messages = [response.data.message];
          this.setState(current_state);
        }
        else{
          current_state.redirect = true;
          this.setState(current_state);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    event.preventDefault();
  }

  render_response() {
    if (this.state.error_response.has_errors) {
      let errors =  this.state.error_response.error_messages.map(messages => {
        return messages
      });
      return <div className="alert alert-danger" role="alert">{errors}</div>
    }
  }

  render() {
    let user_type_opts = this.props.user_types.map(type => {
      return <option key={type} value={type} className="text-capitalize">{type}</option>
    }).reverse();

    if (this.state.redirect) {
      return <Redirect to="/" />
    }

    return (
      <div className="SignUp">
      <br/>
      <div className="container-fluid">
          <div className="row">
            <div className="col-sm-4 offset-sm-4 offset-sm-4">
            {/* FORM HERE */}
              <form  onSubmit={this.register.bind(this)}>
                <div className="card bg-darkblue">
                  <div className="card-header text-center">
                    <h3 className="text-orange"><i className="fas fa-user-plus"></i>&nbsp;Sign Up</h3>
                  </div> 
                  <div className="card-body">
                    {this.render_response()}
                    <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={evt => this.update_username(evt)} placeholder="Username" />
                    <br/>
                    <input type="text" className="form-control" id="email" name="email" value={this.state.email} onChange={evt => this.update_email(evt)} placeholder="Email" />
                    <br/>
                    <select value={this.state.user_type} onChange={evt => this.update_user_type(evt)} className="form-control text-capitalize">
                      {user_type_opts}
                    </select>
                    <br/>
                    <input type="Password" className="form-control" id="password" name="password" value={this.state.password} onChange={evt => this.update_password(evt)} placeholder="Password" />
                    <br/>
                    <input type="Password" className="form-control" id="confirm" name="confirm"  value={this.state.confirm} onChange={evt => this.update_confirm(evt)} placeholder="Re-type Password" />
                    <br/>
                  </div> 
                  <div className="card-footer text-right">
                    <button type="submit" className="btn btn-outline-info">Submit</button>
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

export default SignUp;