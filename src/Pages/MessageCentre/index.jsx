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
      sendTo: {},
      filter: ''
    };
  }

  async componentDidMount() {
    await this.loadContacts(true);
    this.timer = setInterval(async () => {
      console.log('fetching messages...');
      await this.loadContacts(false);
    }, 30000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  hideNewContact = () => {
    this.setState({
      messageNewContact: false,
      sendTo: {
        name: this.state.selectedContact.name,
        number: this.state.selectedContact.number,
        jigsawId: null
      }
    });
  };

  showNewContact = () => {
    this.setState({
      messageNewContact: true,
      sendTo: {
        name: '',
        number: '',
        jigsawId: null
      }
    });
  };

  updateSendTo(propName, value) {
    let sendTo = this.state.sendTo;
    sendTo[propName] = value;
    this.setState({ sendTo });
  }

  async selectContact(selectedContact) {
    const selectedMessages = await FetchMessages(selectedContact.id);

    if (!this.state.messageNewContact) {
      this.setState({
        sendTo: {
          name: selectedContact.name,
          number: selectedContact.number,
          jigsawId: null
        }
      });
    }

    this.setState({ selectedContact, selectedMessages });
  }

  async loadContacts(selectNewest) {
    let contacts = await FetchContacts();
    contacts = contacts.sort((a, b) => {
      return (
        a.lastMessage &&
        b.lastMessage &&
        new Date(b.lastMessage.time) - new Date(a.lastMessage.time)
      );
    });

    if (contacts.length > 0 && selectNewest) {
      this.selectContact(contacts[0]);
    }

    this.setState({ contacts });
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
            hideNewContact={this.hideNewContact.bind(this)}
            showNewContact={this.showNewContact.bind(this)}
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
            <MessageNewContact updateSendTo={this.updateSendTo.bind(this)} />
          ) : (
            <SelectedMessages messages={this.state.selectedMessages} />
          )}
          <MessageEntry
            contacts={this.state.contacts}
            sendTo={this.state.sendTo}
            loadContacts={this.loadContacts.bind(this)}
            hideNewContact={this.hideNewContact.bind(this)}
          />
        </div>
      </div>
    );
  }
}
