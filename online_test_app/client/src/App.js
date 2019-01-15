import React, { Component } from 'react';

// Routing
import { BrowserRouter as Router } from 'react-router-dom';
import Route from 'react-router-dom/Route';

// components
import MainNav from './components/main_nav';
import SignUp from './components/sign_up';
import SignIn from './components/sign_in';
import UserIndex from './components/user_index';


class App extends Component {
  state = {
    users: []
  }

  componentDidMount() {
    fetch('/api')
      .then(response => response.json())
      .then(users => this.setState({ users }));
  }

  render() {

    let users = this.state.users.map((user) => {
      return <li key={user.username}> {user.username} </li>
    })

    return (
      <Router>
      <div className="App">
      <MainNav />

        {/* routes */}

        {/* home */}
        <Route path="/" exact render={() => {
          return (
            <div>
            Hello User
            <ul>
              {users}
            </ul>
            </div>
          );
        }} />
        {/* home */}

        {/* sign_up */}
        <Route path="/signup" exact component={ SignUp } />
        {/* sign_up */}

        {/* sign_in */}
        <Route path="/signin" exact component={ SignIn } />
        {/* sign_in */}

        {/* user_index */}
        <Route path="/main" exact component={ UserIndex } />
        {/* user_index */}

      </div>
      </Router>
    );
  }
}

export default App;
