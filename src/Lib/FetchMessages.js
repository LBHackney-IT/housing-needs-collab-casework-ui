import { AuthHeader } from '.';

async function FetchMessages() {
  const response = await fetch(
    `${process.env.REACT_APP_HN_API_URL}/messages`,
    AuthHeader
  );

  return await response.json();
}

export default FetchMessages;
