import React, { Component } from 'react';
import axios from 'axios';
import refresh_token from './refresh_token';
// components


class UserIndex extends Component {
  state = {}

  componentDidMount() {
    axios.get('/api/user/user_data', {
      headers: {
        authorization: localStorage.getItem('access_token')
      }
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      refresh_token();
    });
  }

  render() {

    return (
      <div className="UserIndex">
      </div>
    );
  }
}

export default UserIndex;