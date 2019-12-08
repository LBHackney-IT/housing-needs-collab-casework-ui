import React, { Component } from 'react';

export default class MessageNewContact extends Component {
  render() {
    return (
      <div>
        <p>
          <label className="govuk-label lbh-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="govuk-input"
            onChange={this.props.updateNewContact}
          />
        </p>
        <p>
          <label className="govuk-label lbh-label" htmlFor="number">
            Number
          </label>
          <input
            type="text"
            name="number"
            className="govuk-input"
            onChange={this.props.updateNewContact}
          />
        </p>
      </div>
    );
  }
}
