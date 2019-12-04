import React, { Component } from 'react';
import { FetchContacts, FetchMessages } from '../../Lib';
import './index.css';

export default class MessageCentre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      filteredContacts: [],
      selectedContact: {},
      selectedMessages: []
    };
    this.filterContacts = this.filterContacts.bind(this);
  }

  async componentDidMount() {
    const contacts = await FetchContacts();
    const selectedContact = contacts.length > 0 ? contacts[0] : {};
    this.setState({ contacts, filteredContacts: contacts, selectedContact });

    if (selectedContact.id) {
      await this.selectContact(selectedContact);
    }
  }

  async filterContacts(e) {
    const includes = (str, sub) =>
      str && str.toLowerCase().includes(sub.toLowerCase());

    const filteredContacts = this.state.contacts.filter(
      c =>
        includes(c.name, e.target.value) || includes(c.number, e.target.value)
    );

    this.setState({ filteredContacts });
  }

  async selectContact(selectedContact) {
    const selectedMessages = await FetchMessages(selectedContact.id);
    this.setState({ selectedContact, selectedMessages });
  }

  render() {
    return (
      <div id="messageCentre">
        <div className="contactPane">
          <div className="contactTools">
            <div className="newContact">
              <button className="govuk-button lbh-button">
                Message New Contact
              </button>
            </div>
            <div className="findContact">
              <input
                type="text"
                className="govuk-input"
                onChange={this.filterContacts}
                placeholder="Find contact..."
              />
            </div>
          </div>
          <ul>
            {this.state.filteredContacts.map((c, i) => {
              return (
                <li
                  key={i}
                  className={
                    c.id === this.state.selectedContact.id ? 'selected' : ''
                  }
                  onClick={() => this.selectContact(c)}
                >
                  <div className="contactName">{c.name}</div>
                  <div className="contactNumber">{c.number}</div>
                  <div className="lastMessage">
                    {c.lastMessage.message.length > 36
                      ? `${c.lastMessage.message.substring(0, 34)}...`
                      : c.lastMessage.message}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="messagePane">
          <ul>
            {this.state.selectedMessages.map((m, i) => {
              console.log(m);
              return (
                <li key={i}>
                  <div className={m.outgoing ? 'me' : 'them'}>
                    <div className="message">{m.message}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
