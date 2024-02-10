const sheetId = "1g1McJwmlqukKte20fGJy8vkb_3kiEcni1IOVTLbA230";
const scopes =  'https://www.googleapis.com/auth/spreadsheets.readonly';
const tokenPath =  path.join(process.cwd(), 'token.json');
const credentialsPath = path.join(process.cwd(), 'credentials.json');

module.exports = {sheetId, scopes, tokenPath, credentialsPath}