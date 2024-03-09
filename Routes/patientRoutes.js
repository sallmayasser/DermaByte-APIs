const express = require('express');
const functions = require('../controllers/patientController');
const validators = require('../utils/validators/patientValidator');
const {getAllReservations} = require('../controllers/labReservationController');
const { getRequestedTests } = require('../controllers/requestedTestController');
const DReservation = require('../controllers/doctorReservationController');
const Scans = require('../controllers/scansController');
const report = require('../controllers/reportController');
const result = require('../controllers/resultController');
const {
  createFilterObj,
  changeUserPassword,
  updateLoggedUserPassword,
  deleteLoggedUserData,
  getLoggedUserData,
} = require('../controllers/handlersFactory');
const patient = require('../models/patientModel');
const { resizeImage } = require('../controllers/resizeImgController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// patient routes 

router.get(
  '/getMe',
  authController.allowedTo('patient'),
  getLoggedUserData,
  functions.getPatient,
);
router.put('/changeMyPassword', authController.allowedTo('patient'), updateLoggedUserPassword(patient));
router.put(
  '/updateMe', authController.allowedTo('patient'),functions.uploadPatientImage ,functions.resizePatientImage,
  validators.updateLoggedPatientValidator,
  functions.updateLoggedPatientData,
);
router.delete(
  '/deleteMe',
  authController.allowedTo('patient'),
  deleteLoggedUserData(patient),
);


// admin routes
router
  .route('/')
  .get( authController.allowedTo('admin'),functions.getAllPatients)
  // .post(authController.protect,authController.allowedTo("admin"),functions.uploadPatientImage,functions.resizePatientImage, validators.createPatientValidator, functions.createPatient);
  // .post(functions.uploadPatientImage ,resizeImage ,validators.createPatientValidator ,functions.createPatient);

router
  .route('/:id')
  .get(validators.getPatientValidator, functions.getPatient)
  .put(authController.allowedTo("admin"),functions.uploadPatientImage ,resizeImage,validators.updatePatientValidator, functions.updatePatient)
  .delete(authController.allowedTo("admin"),validators.deletePatientValidator, functions.deletePatient);


// nested Routes
  
router.route('/:id/Patient-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, authController.allowedTo("patient") ,DReservation.getAllReservations);

router.route('/:id/laboratory-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, authController.allowedTo("patient") ,getAllReservations);

router.route('/:id/Scans').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, authController.allowedTo("patient") , Scans.getScans);

router.route('/:id/reports').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, authController.allowedTo("patient") , report.getReports);

router.route('/:id/results').get((req, res, next) => {
  createFilterObj(req, res, next, 'patient');
}, authController.allowedTo("patient") ,result.getResults);

// router.route('/:id/requested-tests').get((req, res, next) => {
//   createFilterObj(req, res, next, 'patient');
// }, getRequestedTests);

router.put(
  '/changePassword/:id', authController.protect,authController.allowedTo("admin") ,
  validators.changePatientPasswordValidator,
  changeUserPassword(patient),
);
module.exports = router;
