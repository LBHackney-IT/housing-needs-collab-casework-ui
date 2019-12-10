import { AuthHeader } from '.';

async function CreateContact(contact) {
  var headers = {
    'Content-Type': 'application/json',
    'Access-Control-Origin': '*',
    Authorization: AuthHeader.headers.Authorization
  };

  const response = await fetch(`${process.env.REACT_APP_HN_API_URL}/contacts`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(contact)
  });

  return await response.json();
}

export default CreateContact;
