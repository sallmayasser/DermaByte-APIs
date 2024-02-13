const express = require('express');
const functions = require('../controllers/patientController');
const validators = require('../utils/validators/patientValidator');
const DrReservation = require("./doctorReservationRoutes");

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(functions.getAllPatients)
  .post(functions.createPatient, validators.createPatientValidator);

router
  .route('/:id')
  .get(validators.getPatientValidator, functions.getPatient)
  .put(validators.updatePatientValidator, functions.updatePatient)
  .delete(validators.deletePatientValidator, functions.deletePatient);

router.use('/:id/Dermatologist-reservation', DrReservation);
module.exports = router;
