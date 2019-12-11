import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const isLoggedIn = function() {
  const hackneyToken = Cookies.get('hackneyToken');
  if (!hackneyToken) return false;

  const payload = jwt.decode(hackneyToken);
  return (
    payload &&
    payload.groups &&
    payload.groups.indexOf('housing-needs-collabtools-proto') > -1
  );
};

export const username = function() {
  const hackneyToken = Cookies.get('hackneyToken');
  if (!hackneyToken) return false;
  const decoded = jwt.decode(hackneyToken);
  return decoded ? decoded.name : '';
};

export const hackneyToken = function() {
  return Cookies.get('hackneyToken');
};
