import React, { Component } from 'react';
import moment from 'moment';

export default class SelectedMessages extends Component {
  constructor(props) {
    super(props);
    this.messageList = React.createRef();
  }

  componentDidUpdate() {
    // scroll to latest message
    this.messageList.current.scrollTop = this.messageList.current.scrollHeight;
  }

  getDateComponent(thisDate, lastDate) {
    if (thisDate === lastDate) return;
    return (
      <div className="date">
        <div className="dateText">{thisDate}</div>
      </div>
    );
  }

  render() {
    let lastDate;
    return (
      <ul ref={this.messageList}>
        {this.props.messages.map((m, i) => {
          const thisDate = moment(m.time).format('DD/MM/YYYY');
          const dateComponent = this.getDateComponent(thisDate, lastDate);
          lastDate = thisDate;

          return (
            <li key={i}>
              {dateComponent}
              <div className={m.outgoing ? 'me' : 'them'}>
                <div
                  className="message"
                  dangerouslySetInnerHTML={{
                    __html: m.message.replace(/\n/g, '<br>')
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
