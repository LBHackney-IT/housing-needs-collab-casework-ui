import React, { Component } from 'react';
import MessageNewContact from '../../Components/MessageNewContact';
import SelectedMessages from '../../Components/SelectedMessages';
import {
  FetchContacts,
  FetchMessages,
  SendMessage,
  CreateContact
} from '../../Lib';
import MessageEntry from '../../Components/MessageEntry';
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

  sendMessage = async (message, cb) => {
    if (!message) return;

    if (this.state.messageNew) {
      // create contact
      let contact = await CreateContact(this.state.newContact);
      await SendMessage(contact.id, message);
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
      await SendMessage(this.state.selectedContact.id, message);
      await this.selectContact(this.state.selectedContact);
    }
    cb();
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
          {this.state.messageNew ? (
            <MessageNewContact
              updateNewContactState={this.updateNewContactState.bind(this)}
              newContact={this.state.newContact}
            />
          ) : (
            <SelectedMessages messages={this.state.selectedMessages} />
          )}
          <MessageEntry onSend={this.sendMessage} />
        </div>
      </div>
    );
  }
}
