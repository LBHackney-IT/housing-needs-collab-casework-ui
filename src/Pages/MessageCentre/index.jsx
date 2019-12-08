import React, { Component } from 'react';
import MessageNewContact from '../../Components/MessageNewContact';
import SelectedMessages from '../../Components/SelectedMessages';
import Contacts from '../../Components/Contacts';
import ContactTools from '../../Components/ContactTools';
import { FetchContacts, FetchMessages } from '../../Lib';
import MessageEntry from '../../Components/MessageEntry';
import './index.css';

export default class MessageCentre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      selectedContact: {},
      selectedMessages: [],
      messageNewContact: false,
      newContact: {},
      filter: ''
    };
  }

  async componentDidMount() {
    await this.loadContacts();
  }

  async componentDidUpdate() {
    // scroll to latest message
    const pane = document.querySelector('.messagePane ul');
    if (pane) {
      pane.scrollTop = pane.scrollHeight;
    }
  }

  toggleNewContact = () => {
    const messageNewContact = !this.state.messageNewContact;
    const newContact = { name: '', number: '', jigsawId: null };
    this.setState({ messageNewContact, newContact });
  };

  resetNewContact = () => {
    this.setState({ newContact: { name: '', number: '', jigsawId: null } });
  };

  updateNewContact(event) {
    let newContact = this.state.newContact;
    newContact[event.target.name] = event.target.value;
    this.setState({ newContact });
  }

  async selectContact(selectedContact) {
    const selectedMessages = await FetchMessages(selectedContact.id);
    this.setState({ selectedContact, selectedMessages });
  }

  async loadContacts() {
    let contacts = await FetchContacts();
    contacts = contacts.sort((a, b) => {
      return (
        a.lastMessage &&
        b.lastMessage &&
        new Date(b.lastMessage.time) - new Date(a.lastMessage.time)
      );
    });

    if (contacts.length > 0) {
      this.selectContact(contacts[0]);
    }

    this.setState({
      contacts
    });
  }

  setFilter(event) {
    this.setState({ filter: event.currentTarget.value });
  }

  render() {
    return (
      <div id="messageCentre">
        <div className="contactPane">
          <ContactTools
            messageNewContact={this.state.messageNewContact}
            toggleNewContact={this.toggleNewContact.bind(this)}
            setFilter={this.setFilter.bind(this)}
          />
          <Contacts
            contacts={this.state.contacts}
            selectedContact={this.state.selectedContact}
            selectContact={this.selectContact.bind(this)}
            filter={this.state.filter}
          />
        </div>
        <div className="messagePane">
          {this.state.messageNewContact ? (
            <MessageNewContact
              newContact={this.state.newContact}
              updateNewContact={this.updateNewContact.bind(this)}
            />
          ) : (
            <SelectedMessages messages={this.state.selectedMessages} />
          )}
          <MessageEntry
            newContact={this.state.newContact}
            selectedContact={this.state.selectedContact}
            loadContacts={this.loadContacts.bind(this)}
            toggleNewContact={this.toggleNewContact.bind(this)}
          />
        </div>
      </div>
    );
  }
}
