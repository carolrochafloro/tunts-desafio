const {sheetId} = require('../utils/config.js')
const {google} = require('googleapis');

/* Receives an authorization from the authorize function and the desired range as parameters, returns a two-dimensional array. */

async function getSheetData(auth, range) {

  const sheets = google.sheets({version: 'v4', auth});

  const result = await sheets.spreadsheets.values.get({

    spreadsheetId: sheetId,
    range: range,

  });

  const rows = result.data.values;
  
  return rows
}

module.exports = getSheetData
