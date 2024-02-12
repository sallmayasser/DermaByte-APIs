const express = require('express');
const functions = require('../controllers/patientController');
const validators = require('../utils/validators/patientValidator');

const router = express.Router();

router
  .route('/')
  .get(functions.getAllPatients)
  .post(functions.createPatient, validators.createPatientValidator);

router
  .route('/:id')
  .get(validators.getPatientValidator, functions.getPatient)
  .put(validators.updatePatientValidator, functions.updatePatient)
  .delete(validators.deletePatientValidator, functions.deletePatient);

module.exports = router;
