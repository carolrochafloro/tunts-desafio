const absencesController = require('./controllers/absences.js');
const gradesController = require('./controllers/grades.js');

async function runApp() {
  try {

    await absencesController.absences();
    console.log('Absences controller executed successfully.');

    await gradesController();
    console.log('Grades controller executed successfully.');

    console.log('All controllers executed successfully.');
  } catch (error) {
    console.error('Error running controllers:', error);
  }
}

runApp();
