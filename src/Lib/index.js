import FetchMessages from './FetchMessages';
import FetchContacts from './FetchContacts';
import { hackneyToken } from './Cookie';

const AuthHeader = {
  headers: {
    Authorization: `Bearer ${hackneyToken()}`,
    'Content-Type': 'application/json'
  }
};

export { AuthHeader, FetchMessages, FetchContacts };
