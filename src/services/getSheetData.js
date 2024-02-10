const {sheetId} = require('../utils/config.js')
const {google} = require('googleapis');

/* Receives an authorization and the range as parameters, returns a two-dimensional array. */

async function getSheetData(auth, range) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  return rows
}

module.exports = getSheetData
