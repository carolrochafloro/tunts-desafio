const authorize = require('../utils/authorization.js');
const getSheetData = require('../services/getSheetData.js');
const { google } = require('googleapis');
const updateSheet = require('../services/updateSheet.js');
const {passedStudents} = require('./absences.js');

/* This function takes an array containing students who were not failed due to absence, retrieves the grades (P1, P2, P3) of all students, iterates through the array of students, compares them with those who were not failed due to absence, calculates the average, and pushes objects with the range and input expected according to the rules to the array that will be passed as a parameter to the updateSheet function. */

async function grades() {
  try {
    /* get data */
    const auth = await authorize();
    const grades = await getSheetData(auth, 'D4:F27');

    console.log('Grades', grades);

    /* associate each index with a row in the column and return an array of objects. */

    const studentsArray = grades.map((absence, index) => {
      const studentNumber = index + 4;
      const p1 = Number(absence[0]);
      const p2 = Number(absence[1]);
      const p3 = Number(absence[2]);

      return { studentNumber, p1, p2, p3 };
    });

    console.log('Students array of objects: ', studentsArray);
    console.log('Passed students imported: ', passedStudents);

    /* compare studentsArray with passedStudent array before updating */
    const batchUpdateStudents = []

    studentsArray.forEach(student => {

      if (passedStudents.some(passedStudent => passedStudent.studentNumber === student.studentNumber)) {
        
        const studentAvg = Math.ceil((student.p1 + student.p2 + student.p3) / 3);

        if (studentAvg >= 70) {

          console.log('Updating for approved student number:', student.studentNumber);
          const input = 'Aprovado';
          const finalGrade = 0;

          batchUpdateStudents.push({range: `G${student.studentNumber}`, values: [[input]]}, {range: `H${student.studentNumber}`, values: [[finalGrade]] })
        } else if (studentAvg < 50) {

          console.log('Updating for failed student number:', student.studentNumber);
          const input = 'Reprovado por Nota';
          const finalGrade = 0;

          batchUpdateStudents.push({range: `G${student.studentNumber}`, values: [[input]]}, {range: `H${student.studentNumber}`, values: [[finalGrade]] })
        } else {

          console.log('Updating for student with Exame Final:', student.studentNumber);
          const input = 'Exame final';
          const naf = Math.ceil(100 - studentAvg);

          batchUpdateStudents.push({range: `G${student.studentNumber}`, values: [[input]]}, {range: `H${student.studentNumber}`, values: [[naf]] })
        }
      }
    });

    updateSheet(auth, batchUpdateStudents)

    return console.log('Updated grades sheet.');
  } catch (error) {
    console.error('Error in grades controller: ', error);
  }
}

module.exports = grades;
