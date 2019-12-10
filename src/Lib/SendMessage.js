import { AuthHeader } from '.';

async function SendMessage(id, message) {
  var headers = {
    'Content-Type': 'application/json',
    'Access-Control-Origin': '*',
    Authorization: AuthHeader.headers.Authorization
  };

  const response = await fetch(
    `${process.env.REACT_APP_HN_API_URL}/contacts/${id}/messages`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        message: message
      })
    }
  );

  return await response.json();
}

export default SendMessage;
