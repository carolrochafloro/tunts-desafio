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

    /* associate each index with a row in the column. */

    const studentsArray = absencesArray.map((absence, index) => {
      const studentNumber = index + 4;
      const studentAbsence = parseInt(absence[0], 10);

      return {studentNumber, studentAbsence};
    });

    console.log('Students array of objects: ', studentsArray);

    studentsArray.forEach(student => {
      const percentualAbsences = (student.studentAbsence / totalClasses) * 100;

      if (percentualAbsences > 25) {
        const input = "Reprovado por Falta";
        const finalGrade = 0
          console.log('Updating for failed due to absence student number:', `G${student.studentNumber}`);
          updateSheet(auth, `G${student.studentNumber}`, input);
          updateSheet(auth, `H${student.studentNumber}`, finalGrade)
      } else {
        passedStudents.push(student)
      }
    });

return console.log('Updated students failed due to absence.')
    
  } catch (error) {
    console.error('Error in absenses controller: ', error);
  }
}
module.exports = { passedStudents, absences };


