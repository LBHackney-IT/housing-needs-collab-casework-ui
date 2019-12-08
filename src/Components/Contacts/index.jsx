import React, { Component } from 'react';

export default class Contacts extends Component {
  filterContact(contact) {
    const includes = (str, sub) =>
      str && str.toLowerCase().includes(sub.toLowerCase());

    return (
      includes(contact.name, this.props.filter) ||
      includes(contact.number, this.props.filter)
    );
  }

  formatLastMessage(contact) {
    if (contact.lastMessage && contact.lastMessage.message) {
      return contact.lastMessage.message.length > 36
        ? `${contact.lastMessage.message.substring(0, 34)}...`
        : contact.lastMessage.message;
    }
  }

  render() {
    return (
      <ul>
        {this.props.contacts
          .filter(c => this.filterContact(c))
          .map((c, i) => {
            return (
              <li
                key={i}
                className={
                  c.id === this.props.selectedContact.id ? 'selected' : ''
                }
                onClick={() => this.props.selectContact(c)}
              >
                <div className="contactName">
                  {c.name}{' '}
                  {c.lastMessage && c.lastMessage.direction === 'incoming' && (
                    <div className="yourTurn">YOUR TURN</div>
                  )}
                </div>
                <div className="contactNumber">{c.number}</div>
                <div className="lastMessage">{this.formatLastMessage(c)}</div>
              </li>
            );
          })}
      </ul>
    );
  }
}
