const {sheetId} = require('../utils/config.js')
const {google} = require('googleapis');

/* Updates specific cells or a range. Inserts the data as USER_ENTERED, so that the input is analyzed exactly as if it had been typed in the Sheets interface. It receives authentication, and an array of objets, each one containing the range as a string and an arry of arrays with the input. */

async function updateSheet(auth, data) {
  const sheets = google.sheets({ version: 'v4', auth });
  
  const resource = {
    data: data,
    valueInputOption: 'USER_ENTERED',
  };

  try {

    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      resource: resource,
    });

    const rows = result.data.values;

    return rows;

  } catch (error) {

    console.error('Error updating sheet:', error.message);
    throw error;
    
  }
}

module.exports = updateSheet
