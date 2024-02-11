const authorize = require('../utils/authorization.js')
const getSheetData = require('../services/getSheetData.js')
const {google} = require('googleapis');
const updateSheet = require('../services/updateSheet.js')
const {scopeRead, scopeModify} = require('../utils/config.js')


/*
1- ler dias de aula - linha 2, split, converter string em number
2- ler coluna C
3- atrelar cada index a uma linha da coluna (linha começa a partir da 4, index começa a partir do 0)
4- calcular percentual
5- salvar linha dos que tiveram >= 25% em um array
6- alterar linha do array salvo (colunas G e H)
*/
async function absences() {
  
  try {
    /* get data */
    const auth = await authorize();
    const stringTotalClasses = await getSheetData(auth, 'A2');
    const absencesArray = await getSheetData(auth, 'C4:C24');

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
      const studentAbsence = Number(absence[0]);

      return {studentNumber, studentAbsence};
    });

    console.log('Students array of objects: ', studentsArray);

    /* Select students with more than 25% of absences in a new array */
    const failedStudents = []

    studentsArray.forEach(student => {
      const percentualAbsences = (student.studentAbsence / totalClasses) * 100;

      if (percentualAbsences > 25) {
        failedStudents.push(student)
      }    
    });

    console.log('Failed students: ', failedStudents);
     /* insert update function iterating over the range with student.number. */

    const input = "Reprovado";
    const finalGrade = 0
    failedStudents.forEach(student => {
      console.log('Updating for student number:', `G${student.studentNumber}`);
      updateSheet(auth, `G${student.studentNumber}`, input);
      updateSheet(auth, `H${student.studentNumber}`, finalGrade)
    });
    
  
return console.log('Updated sheet.')
    
  } catch (error) {
    console.error('Erro:', error);
  }
  

}

async function runTest() {
await absences();
}

runTest();

