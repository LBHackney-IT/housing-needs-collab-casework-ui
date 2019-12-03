import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isLoggedIn } from 'Lib/Cookie';

export default class Login extends Component {
  render() {
    if (isLoggedIn() === true) {
      return <Redirect to="/" />;
    }

    const redirect_uri = `${window.location.protocol}//${window.location.host}`;

    return (
      <div className="loginPage">
        <h1>Please log in</h1>
        <a
          href={`https://auth.hackney.gov.uk/auth?redirect_uri=${redirect_uri}`}
        >
          Log in with Google
        </a>
      </div>
    );
  }
}
