const express = require('express');
const functions = require('../controllers/patientController');
const validators = require('../utils/validators/patientValidator');
const {getAllReservations} = require('../controllers/labReservationController');
const { getRequestedTests } = require('../controllers/requestedTestController');
const DReservation = require('../controllers/doctorReservationController');
const Scans = require('../controllers/scansController');
const report = require('../controllers/reportController');
const result = require('../controllers/resultController');
const {createFilterObj,changeUserPassword} = require('../controllers/handlersFactory');
const patient = require('../models/patientModel');
const { resizeImage } = require('../controllers/resizeImgController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(functions.getAllPatients)
  .post(authController.protect,authController.allowedTo("patient"),functions.uploadPatientImage,functions.resizePatientImage, validators.createPatientValidator, functions.createPatient);
  // .post(functions.uploadPatientImage ,resizeImage ,validators.createPatientValidator ,functions.createPatient);

router
  .route('/:id')
  .get(validators.getPatientValidator, functions.getPatient)
  .put(authController.protect,authController.allowedTo("patient"),functions.uploadPatientImage ,resizeImage,validators.updatePatientValidator, functions.updatePatient)
  .delete(authController.protect,authController.allowedTo("patient"),validators.deletePatientValidator, functions.deletePatient);

router.route('/:id/Patient-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, DReservation.getAllReservations);

router.route('/:id/laboratory-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, getAllReservations);

router.route('/:id/Scans').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, Scans.getScans);

router.route('/:id/reports').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, report.getReports);

router.route('/:id/results').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, result.getResults);

router.route('/:id/requested-tests').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, getRequestedTests);

router.put(
  '/changePassword/:id',
  validators.changePatientPasswordValidator,
  changeUserPassword(patient),
);
module.exports = router;
