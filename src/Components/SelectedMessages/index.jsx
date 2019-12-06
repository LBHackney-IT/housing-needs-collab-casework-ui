import React, { Component } from 'react';
import moment from 'moment';

export default class SelectedMessages extends Component {
  render() {
    let lastDate;
    return (
      <ul>
        {this.props.messages
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
                  <div
                    className="message"
                    dangerouslySetInnerHTML={{
                      __html: m.message.replace('\n', '<br>')
                    }}
                  />
                </div>
              </li>
            );
          })}
      </ul>
    );
  }
}
