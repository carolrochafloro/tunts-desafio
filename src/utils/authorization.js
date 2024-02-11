const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { scopeModify } = require('./config');


/* Authorization function. If there's a token.json in the directory it'll load it. If there isn't one yet, it'll create a new file after login via browser. */

const tokenPath = path.resolve(__dirname, 'token.json');
const credentialsPath = path.resolve(__dirname, 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(tokenPath);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    console.error('No credentials found:', err );
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(credentialsPath);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(tokenPath, payload);
}


async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: scopeModify,
    keyfilePath: credentialsPath,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


module.exports = authorize