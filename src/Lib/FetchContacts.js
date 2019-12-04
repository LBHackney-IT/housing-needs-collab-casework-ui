import { AuthHeader } from '.';

async function FetchContacts() {
  const response = await fetch(
    `${process.env.REACT_APP_HN_API_URL}/contacts`,
    AuthHeader
  );

  return await response.json();
}

export default FetchContacts;
