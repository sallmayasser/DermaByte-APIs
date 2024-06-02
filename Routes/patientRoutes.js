const express = require('express');
const functions = require('../controllers/patientController');
const validators = require('../utils/validators/patientValidator');
const {
  getAllReservations,
} = require('../controllers/labReservationController');
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
const { resizeImage, uploadImage } = require('../controllers/imageController');
const authController = require('../controllers/authController');
const { getReviews } = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// patient routes

router.get(
  '/getMe',
  authController.allowedTo('patient'),
  getLoggedUserData,
  functions.getPatient,
);

router.put(
  '/updateMe',
  authController.allowedTo('patient'),
  getLoggedUserData,
  uploadImage,
  functions.setPatientToBody,
  resizeImage,
  validators.updateLoggedPatientValidator,
  functions.updateLoggedPatientData,
);

router.delete(
  '/deleteMe',
  authController.allowedTo('patient'),
  deleteLoggedUserData(patient),
);

router.put(
  '/changeMyPassword',
  authController.allowedTo('patient'),
  validators.changePatientPasswordValidator,
  updateLoggedUserPassword(patient),
);
// nested Routes

router.route('/laboratory-reservation').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'patient');
  },
  authController.allowedTo('patient'),
  getAllReservations,
);

router.route('/Scans').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'patient');
  },
  authController.allowedTo('patient'),
  Scans.getScans,
);

router.route('/reports').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'patient');
  },
  authController.allowedTo('patient'),
  report.getReports,
);

router.route('/results').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'patient');
  },
  authController.allowedTo('patient'),
  result.getResults,
);
router.get(
  '/Patient-reservation',
  authController.allowedTo('patient'),
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'patient');
  },
  DReservation.getAllReservations,
);
router.route('/reviews').get(
  authController.allowedTo('patient'),
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'patient');
  },
  getReviews,
);

// admin routes
router
  .route('/')
  .get(authController.allowedTo('admin'), functions.getAllPatients);
// .post(authController.protect,authController.allowedTo("admin"),functions.uploadPatientImage,functions.resizePatientImage, validators.createPatientValidator, functions.createPatient);
// .post(functions.uploadPatientImage ,resizeImage ,validators.createPatientValidator ,functions.createPatient);

router
  .route('/:id')
  .get(validators.getPatientValidator, functions.getPatient)
  .put(
    authController.allowedTo('admin'),
    uploadImage,
    resizeImage,
    validators.updatePatientValidator,
    functions.updatePatient,
  )
  .delete(
    authController.allowedTo('admin'),
    validators.deletePatientValidator,
    functions.deletePatient,
  );

// router.route('/:id/requested-tests').get((req, res, next) => {
//   createFilterObj(req, res, next, 'patient');
// }, getRequestedTests);

router.put(
  '/changePassword/:id',
  authController.protect,
  authController.allowedTo('admin'),
  validators.changePatientPasswordValidator,
  changeUserPassword(patient),
);
module.exports = router;
