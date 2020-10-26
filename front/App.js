import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventPage from './pages/Events';
import BookingPage from './pages/Bookings';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Navigation />
    <main className="main-content">
      <Switch>
        <Redirect from="/" to="/auth" exact/>
        <Route exact path="/auth" component={AuthPage}></Route>
        <Route exact path="/events" component={EventPage}></Route>
        <Route exact path="/bookings" component={BookingPage}></Route>
      </Switch>
    </main>
    </BrowserRouter>
  );
}

export default App;
