import React, { Component } from 'react';

export default class MessageNewContact extends Component {
  constructor(props) {
    super(props);
  }

  formatNumber(number) {
    number = number
      .replace(/[^0-9]/g, '') // remove non digits
      .replace(/^(44){1}/, '') // remove leading '44'
      .replace(/^0{1}/, ''); // remove leading '0'

    const isMobile = RegExp(/^7[0-9]{9}$/);
    return isMobile.test(number) ? `+44${number}` : '';
  }

  updateName = event => {
    this.props.updateSendTo(event.target.name, event.target.value);
  };

  updateNumber = event => {
    const number = this.formatNumber(event.target.value);
    this.props.updateSendTo(event.target.name, number);
  };

  render() {
    return (
      <div>
        <p>
          <label className="govuk-label lbh-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="govuk-input"
            onChange={this.updateName}
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
            onChange={this.updateNumber}
          />
        </p>
      </div>
    );
  }
}
