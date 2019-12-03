import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from 'Components/PrivateRoute';
import Header from 'Components/Header';
import Phase from 'Components/Phase';
import Login from 'Pages/Login';
import MessageCentre from 'Pages/MessageCentre';

export default class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Phase />
        <div id="main-wrapper">
          <div className="lbh-container lbh-body">
            <Router>
              <Route path="/login" component={Login} />
              <PrivateRoute path="/" exact component={MessageCentre} />
            </Router>
          </div>
        </div>
      </>
    );
  }
}
