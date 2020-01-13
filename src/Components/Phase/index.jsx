import React, { Component } from 'react';

export default class Phase extends Component {
  render() {
    return (
      <div className="govuk-phase-banner lbh-phase-banner lbh-container">
        <p className="govuk-phase-banner__content">
          <strong className="govuk-tag govuk-phase-banner__content__tag">
            Alpha
          </strong>
          <span className="govuk-phase-banner__text">
            This is a new service - your{' '}
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfPSZsFJVjg09Flmz4WF_2Tsg4jnIBvwQmSiahwR9LVMw4mEw/viewform">
              feedback
            </a>{' '}
            will help us to improve it.
          </span>
        </p>
      </div>
    );
  }
}
