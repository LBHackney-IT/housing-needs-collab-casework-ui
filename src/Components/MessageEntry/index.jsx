import React, { Component } from 'react';
import './index.css';

export default class MessageEntry extends Component {
  state = {
    message: ''
  };

  send = () => {
    this.props.onSend && this.props.onSend(this.state.message, this.clearMessage);
  };

  clearMessage = () => {
    this.setState({ message: '' });
  };

  updateMessage = e => {
    this.setState({ message: e.target.value, textareaHeight: e.target.scrollHeight });
  };

  style() {
    return {
      'height': `${this.state.textareaHeight}px`
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
          <button className="govuk-button lbh-button" onClick={this.send}>
            Send
          </button>
        </div>
      </div>
    );
  }
}
