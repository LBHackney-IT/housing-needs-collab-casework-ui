import React, { Component } from 'react';
import moment from 'moment';
import { FetchContacts, FetchMessages } from '../../Lib';
import './index.css';

export default class MessageCentre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      filteredContacts: [],
      selectedContact: {},
      selectedMessages: [],
      messageNew: false
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

  async sendMessage(msgBox) {
    if (!msgBox.value) return;

    if (this.state.messageNew) {
      // create contact
      // send to new contact
      this.toggleNew();
    } else {
      // send to current
    }
    msgBox.value = '';
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
              console.log(c);
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
                    {c.lastMessage.direction === 'incoming' && (
                      <div className="yourTurn">YOUR TURN</div>
                    )}
                  </div>
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
          {this.state.messageNew && (
            <div>
              <p>
                <label className="govuk-label lbh-label" htmlFor="name">
                  Name
                </label>
                <input type="text" name="name" className="govuk-input" />
              </p>
              <p>
                <label className="govuk-label lbh-label" htmlFor="number">
                  Number
                </label>
                <input type="text" name="number" className="govuk-input" />
              </p>
            </div>
          )}
          {!this.state.messageNew && (
            <ul>
              {this.state.selectedMessages.map((m, i) => {
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
