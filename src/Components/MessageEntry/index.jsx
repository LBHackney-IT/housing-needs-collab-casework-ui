import React, { Component } from 'react';
import { CreateContact, SendMessage } from '../../Lib';
import './index.css';

export default class MessageEntry extends Component {
  state = {
    message: ''
  };

  sendMessage = async () => {
    if (!this.state.message) return;

    if (this.props.newContact.name) {
      const contact = await CreateContact(this.props.newContact);
      await SendMessage(contact.id, this.state.message);
      this.props.toggleNewContact();
    } else {
      await SendMessage(this.props.selectedContact.id, this.state.message);
    }
    await this.props.loadContacts();
    this.setState({ message: '' });
  };

  updateMessage = event => {
    this.setState({
      message: event.target.value,
      textareaHeight: event.target.scrollHeight
    });
  };

  style() {
    return {
      height: `${this.state.textareaHeight}px`
    };
  }

  render() {
    return (
      <div className="messageEntry">
        <textarea
          type="text"
          className="govuk-input"
          placeholder="Type a message"
          onChange={this.updateMessage}
          style={this.style()}
          value={this.state.message}
        />
        <div className="button">
          <button
            className="govuk-button lbh-button"
            onClick={this.sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}
