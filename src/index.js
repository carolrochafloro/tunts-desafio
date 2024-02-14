const absencesController = require('./controllers/absences.js');
const gradesController = require('./controllers/grades.js');

/* calls the two main controllers of the app and executes them, making shure that the absences controller is run first so that the grades controller will only treat the other students data. */

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
