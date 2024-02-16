const express = require('express');
const functions = require('../controllers/patientController');
const validators = require('../utils/validators/patientValidator');
const {
  getAllReservations,
} = require('../controllers/labReservationController');
const { createFilterObj } = require('../controllers/handlersFactory');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get( functions.getAllPatients)
  .post(functions.createPatient, validators.createPatientValidator);

router
  .route('/:id')
  .get(validators.getPatientValidator, functions.getPatient)
  .put(validators.updatePatientValidator, functions.updatePatient)
  .delete(validators.deletePatientValidator, functions.deletePatient);

router.route('/:id/Dermatologist-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, getAllReservations);

router.route('/:id/laboratory-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, getAllReservations);
module.exports = router;
