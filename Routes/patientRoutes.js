const express = require('express');
const functions = require('../controllers/patientController');
const validators = require('../utils/validators/patientValidator');
const {
  getAllReservations,
} = require('../controllers/labReservationController');
const DReservation = require('../controllers/doctorReservationController');
const Scans = require('../controllers/scansController');
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
}, DReservation.getAllReservations);

router.route('/:id/laboratory-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, getAllReservations);

router.route('/:id/Scans').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, Scans.getScans);
module.exports = router;
