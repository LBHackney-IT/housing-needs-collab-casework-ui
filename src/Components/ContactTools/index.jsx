import React, { Component } from 'react';

export default class ContactTools extends Component {
  render() {
    return (
      <div className="contactTools">
        <div className="newContact">
          <button
            className="govuk-button lbh-button"
            onClick={this.props.toggleNewContact}
          >
            {this.props.messageNewContact ? 'Cancel' : 'Message New Contact'}
          </button>
        </div>
        <div className="findContact">
          <input
            type="text"
            className="govuk-input"
            onChange={this.props.setFilter}
            placeholder="Find contact..."
          />
        </div>
      </div>
    );
  }
}
