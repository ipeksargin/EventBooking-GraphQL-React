import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventPage from './pages/Events';
import BookingPage from './pages/Bookings';
import Navigation from './components/Navigation';
import './App.css';
import AuthContext from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  }
  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId});
  }

  logout = () => {
    this.setState({token:null, userId:null})
  }
  render() {
    return (
      <BrowserRouter>
      <AuthContext.Provider value={{
        token:this.state.token,
        userId:this.state.userId,
        login: this.login,
        logout: this.logout}}>
      <Navigation />
      <main className="main-content">
        <Switch>
          {this.state.token &&<Redirect from="/" to="/events" exact/>}
          {this.state.token &&<Redirect from="/auth" to="/events" exact/>}
          {!this.state.token && <Route exact path="/auth" component={AuthPage}></Route>}
          <Route exact path="/events" component={EventPage}></Route>
          {this.state.token &&<Route exact path="/bookings" component={BookingPage}></Route>}
          {!this.state.token &&<Redirect to="/auth" exact/>}
        </Switch>
      </main>
      </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
