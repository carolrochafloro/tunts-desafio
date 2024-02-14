const {sheetId} = require('../utils/config.js')
const {google} = require('googleapis');

/* Updates specific cells or a range. Inserts the data as USER_ENTERED, so that the input is analyzed exactly as if it had been typed in the Sheets interface. It receives authentication, the range to be modified, and the data to be inserted as params. */

// async function updateSheet(auth, range, input) {
//   const sheets = google.sheets({ version: 'v4', auth });
  
//   const resource = {
//     values: [[input]],
//   };

//   try {
//     const result = await sheets.spreadsheets.values.update({
//       spreadsheetId: sheetId,
//       range: range,
//       valueInputOption: 'USER_ENTERED',
//       resource: resource,
//     });

//     const rows = result.data.values;
//     return rows;
//   } catch (error) {
//     console.error('Error updating sheet:', error.message);
//     throw error;
//   }
// }

/* BATCH UPDTATE */

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
