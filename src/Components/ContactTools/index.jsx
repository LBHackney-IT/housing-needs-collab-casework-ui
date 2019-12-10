import React, { Component } from 'react';

export default class ContactTools extends Component {
  render() {
    const buttonText = this.props.messageNewContact
      ? 'Cancel'
      : 'Start New Conversation';

    return (
      <div className="contactTools">
        <div className="newContact">
          <button
            className="govuk-button lbh-button"
            onClick={
              this.props.messageNewContact
                ? this.props.hideNewContact
                : this.props.showNewContact
            }
          >
            {buttonText}
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
