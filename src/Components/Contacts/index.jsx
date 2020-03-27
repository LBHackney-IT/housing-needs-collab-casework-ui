import React, { Component } from 'react';
import moment from 'moment';
import { user } from '../../Lib/Cookie';

export default class Contacts extends Component {
  filterContact(contact) {
    if (!this.props.filter) {
      if (!contact.lastMessage) {
        return false;
      }

      if (contact.lastMessage && contact.lastMessage.userEmail) {
        return contact.lastMessage.userEmail === user().email;
      }
    }

    const includes = (str, sub) =>
      str && str.toLowerCase().includes(sub.toLowerCase());

    return (
      includes(contact.name, this.props.filter) ||
      includes(contact.number, this.props.filter)
    );
  }

  formatLastMessage(contact) {
    const last = contact.lastMessage.message;
    return last.length > 36 ? `${last.substring(0, 34)}...` : last;
  }

  render() {
    return (
      <ul>
        {this.props.contacts
          .filter(c => this.filterContact(c))
          .map((c, i) => {
            if (i === 0 && !this.props.selectedContact.id) {
              this.props.selectContact(c);
            }
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
                  {c.lastMessage && !c.lastMessage.outgoing && (
                    <div className="yourTurn">&#8226;</div>
                  )}
                </div>
                <div className="contactNumber">{c.number}</div>
                {c.lastMessage && (
                  <div className="lastMessage">
                    {moment(c.lastMessage.time).format('DD/MM/YYYY HH:mm')}{' '}
                    <br />
                    {this.formatLastMessage(c)}
                  </div>
                )}
              </li>
            );
          })}
      </ul>
    );
  }
}
