import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const isLoggedIn = function() {
  return true;
  // const hackneyToken = Cookies.get('hackneyToken');
  // if (!hackneyToken) return false;
  // return jwt.decode(hackneyToken);
};

export const hackneyToken = function() {
  return Cookies.get('hackneyToken');
};
