import React, { Component } from 'react';
import moment from 'moment';
import {
  FetchContacts,
  FetchMessages,
  SendMessage,
  CreateContact
} from '../../Lib';
import './index.css';

export default class MessageCentre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      filteredContacts: [],
      selectedContact: {},
      selectedMessages: [],
      messageNew: false,
      newContact: { name: '', number: '', jigsawId: null }
    };
    this.filterContacts = this.filterContacts.bind(this);
  }

  async loadContacts() {
    let contacts = await FetchContacts();
    contacts = contacts.sort((a, b) => {
      return (
        a.lastMessage &&
        b.lastMessage &&
        a.lastMessage.time < b.lastMessage.time
      );
    });
    this.setState({ contacts, filteredContacts: contacts });
  }

  async componentDidMount() {
    await this.loadContacts();
    const selectedContact =
      this.state.contacts.length > 0 ? this.state.contacts[0] : {};
    this.setState({ filteredContacts: this.state.contacts, selectedContact });

    if (selectedContact.id) {
      await this.selectContact(selectedContact);
    }
  }

  async componentDidUpdate() {
    // scroll to latest message
    const pane = document.querySelector('.messagePane ul');
    if (pane) {
      pane.scrollTop = pane.scrollHeight;
    }
  }

  toggleNew = () => {
    this.setState(state => {
      return { messageNew: !state.messageNew };
    });
  };

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

  updateNewContactState = e => {
    let newContact = this.state.newContact;
    newContact[e.target.name] = e.target.value;
    this.setState({ newContact });
  };

  async sendMessage(msgBox) {
    if (!msgBox.value) return;

    if (this.state.messageNew) {
      // create contact
      let contact = await CreateContact(this.state.newContact);
      await SendMessage(contact.id, msgBox.value);
      await this.loadContacts();
      let selectedContact = this.state.contacts.filter(
        c => c.id === contact.id
      );
      if (selectedContact.length === 1) {
        await this.selectContact(selectedContact[0]);
        // send to new contact
        this.toggleNew();
      }
    } else {
      // send to current
      await SendMessage(this.state.selectedContact.id, msgBox.value);
      await this.selectContact(this.state.selectedContact);
    }
    msgBox.value = '';
  }

  lastMessage(contact) {
    if (contact.lastMessage && contact.lastMessage.message) {
      return contact.lastMessage.message.length > 36
        ? `${contact.lastMessage.message.substring(0, 34)}...`
        : contact.lastMessage.message;
    }
  }

  render() {
    let lastDate;

    return (
      <div id="messageCentre">
        <div className="contactPane">
          <div className="contactTools">
            <div className="newContact">
              <button
                className="govuk-button lbh-button"
                onClick={this.toggleNew}
              >
                {this.state.messageNew ? 'Cancel' : 'Message New Contact'}
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
                  <div className="contactName">
                    {c.name}{' '}
                    {c.lastMessage &&
                      c.lastMessage.direction === 'incoming' && (
                        <div className="yourTurn">YOUR TURN</div>
                      )}
                  </div>
                  <div className="contactNumber">{c.number}</div>
                  <div className="lastMessage">{this.lastMessage(c)}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="messagePane">
          {this.state.messageNew && (
            <div>
              <p>
                <label className="govuk-label lbh-label" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="govuk-input"
                  onChange={this.updateNewContactState}
                  value={this.state.newContact.name}
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
                  onChange={this.updateNewContactState}
                  value={this.state.newContact.number}
                />
              </p>
            </div>
          )}
          {!this.state.messageNew && (
            <ul>
              {this.state.selectedMessages
                .sort((a, b) => (a.time > b.time ? 1 : -1))
                .map((m, i) => {
                  const mDate = moment(m.time).format('DD/MM/YYYY');

                  let dateComponent;

                  if (lastDate !== mDate) {
                    lastDate = mDate;
                    dateComponent = (
                      <div className="date">
                        <div className="dateText">{lastDate}</div>
                      </div>
                    );
                  }

                  return (
                    <li key={i}>
                      {dateComponent}
                      <div className={m.outgoing ? 'me' : 'them'}>
                        <div className="message">{m.message}</div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
          <div className="messageEntry">
            <input
              type="text"
              className="govuk-input"
              placeholder="Type a message"
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.sendMessage(event.target);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
