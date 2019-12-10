import React, { Component } from 'react';
import { CreateContact, SendMessage } from '../../Lib';
import './index.css';

export default class MessageEntry extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '', errorMessage: '', isSending: false };
  }

  isValidMessage = () => {
    if (!this.state.message) {
      this.setState({ errorMessage: 'Message cannot be empty.' });
      return false;
    }
    if (!this.props.sendTo.name) {
      this.setState({ errorMessage: 'Name cannot be empty.' });
      return false;
    }
    if (!this.props.sendTo.number) {
      this.setState({ errorMessage: 'Mobile number is incorrect.' });
      return false;
    }
    return true;
  };

  updateMessage = event => {
    this.setState({
      message: event.target.value,
      textareaHeight: event.target.scrollHeight
    });
  };

  sendMessage = async () => {
    this.setState({ errorMessage: '', isSending: true });
    if (!this.isValidMessage()) return;

    const existingContacts = this.props.contacts.filter(c => {
      return c.number === this.props.sendTo.number;
    });

    const contact = existingContacts.length
      ? existingContacts[0]
      : await CreateContact(this.props.sendTo);

    const response = await SendMessage(contact.id, this.state.message);

    if (response.message) {
      this.setState({ message: '', errorMessage: '', isSending: false });
    } else {
      this.setState({
        errorMessage:
          'There was a problem sending the message, please try again.',
        isSending: false
      });
    }

    await this.props.loadContacts(true);
    this.props.hideNewContact();
  };

  render() {
    return (
      <div className="messageEntry">
        <span
          id="input-with-error-message-error"
          className="govuk-error-message"
        >
          {this.state.errorMessage}
        </span>
        <textarea
          type="text"
          className={`govuk-input ${
            this.state.errorMessage ? 'govuk-input--error' : ''
          }`}
          placeholder="Type a message"
          onChange={this.updateMessage}
          style={{ height: `${this.state.textareaHeight}px` }}
          value={this.state.message}
        />
        <div className="button">
          <button
            className="govuk-button lbh-button"
            onClick={this.sendMessage}
            disabled={this.state.isSending}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}
