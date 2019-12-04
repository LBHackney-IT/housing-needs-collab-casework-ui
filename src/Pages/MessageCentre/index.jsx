import React, { Component } from 'react';
import { FetchContacts, FetchMessages } from '../../Lib';
import './index.css';

export default class MessageCentre extends Component {
  constructor(props) {
    super(props);
    this.state = { contacts: [], filteredContacts: [], selectedMessages: [] };
    this.filterContacts = this.filterContacts.bind(this);
  }

  async componentDidMount() {
    const contacts = await FetchContacts();
    this.setState({ contacts, filteredContacts: contacts });
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

  async selectContact(id) {
    const selectedMessages = await FetchMessages(id);
    this.setState({ selectedMessages });
  }

  render() {
    return (
      <div id="messageCentre">
        <div className="contactPane">
          <div className="contactTools">
            <div className="newContact">
              <button>Message New Contact</button>
            </div>
            <div className="findContact">
              <input type="text" onChange={this.filterContacts} />
            </div>
          </div>
          <ul>
            {this.state.filteredContacts.map((c, i) => {
              return (
                <li key={i} onClick={() => this.selectContact(c.id)}>
                  <div className="contactName">{c.name}</div>
                  <div className="contactNumber">{c.number}</div>
                  <div className="lastMessage">{c.lastMessage.message}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="messagePane">
          <ul>
            {this.state.selectedMessages.map((m, i) => {
              return <li key={i}>{m.message}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}
