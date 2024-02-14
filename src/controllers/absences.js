const authorize = require('../utils/authorization.js')
const getSheetData = require('../services/getSheetData.js')
const {google} = require('googleapis');
const updateSheet = require('../services/updateSheet.js')

/* this function reads the absences of all students and the total number of classes taught in the semester, calculates the percentage of absences, and updates the table with the requested data for students with >25% absences. */

/* this array saves the students who were not failed due to absence so that they are the only ones updated in the grades calculation controller.*/
const passedStudents = [];

async function absences() {
  
  try {
    /* get data - inform correct range according to the requested data. */
    const auth = await authorize();
    const stringTotalClasses = await getSheetData(auth, 'A2');
    const absencesArray = await getSheetData(auth, 'C4:C27');

    console.log('Faltas:', absencesArray);
    console.log('Total classes:', stringTotalClasses);

    /* split stringTotalClasses */
    const colonIndex = stringTotalClasses[0][0].indexOf(':');
    const numberString = stringTotalClasses[0][0].substring(colonIndex + 1).trim();
    const totalClasses = parseInt(numberString, 10);

    console.log("Total classes: ", totalClasses);

    /* associate each index with a row in the column and push each student to a different array according to the situation. failed students data will be pushed into the batchUpdateStudents and the others will be pushed into passedStudents to be trated in the grades controller. */

    const batchUpdateStudents = []

    absencesArray.forEach((absence, index) => {

      const studentNumber = index + 4;
      const studentAbsence = parseInt(absence[0], 10);

      const percentualAbsences = (studentAbsence / totalClasses) * 100;
    
      if (percentualAbsences > 25) {

        const input = "Reprovado por Falta";
        const finalGrade = 0;
        const rangeResult = `G${studentNumber}`
        const rangeGrade = `H${studentNumber}`

        batchUpdateStudents.push(
          {range: rangeResult, values: [[input]]},
          {range: rangeGrade, values: [[finalGrade]]})

      } else {
        passedStudents.push({ studentNumber, studentAbsence });
      }
    });

    console.log('Failed students array of objects: ', batchUpdateStudents);

    updateSheet(auth, batchUpdateStudents)
    
    return console.log('Updated students failed due to absence.')
    
  } catch (error) {
    console.error('Error in absenses controller: ', error);
  }
}
module.exports = { passedStudents, absences };


