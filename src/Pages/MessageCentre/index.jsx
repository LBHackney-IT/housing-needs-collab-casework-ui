import React, { Component } from 'react';

export default class MessageCentre extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: {} };
  }

  async componentDidMount() {
    const response = await FetchMessages();

    this.setState({ messages: response.messages });
  }

  render() {
    return <></>;
  }
}
