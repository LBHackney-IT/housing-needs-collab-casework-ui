import { AuthHeader } from '.';

async function FetchMessages(id) {
  const response = await fetch(
    `${process.env.REACT_APP_HN_API_URL}/contacts/${id}/messages`,
    AuthHeader
  );

  return await response.json();
}

export default FetchMessages;
