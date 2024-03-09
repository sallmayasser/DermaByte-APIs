const express = require('express');
const {
  getDermatologistValidator,
  createDermatologistValidator,
  updateDermatologistValidator,
  deleteDermatologistValidator,
  changedermatologistPasswordValidator,
  updateLoggedDermatologistValidator,
} = require('../utils/validators/dermatologistValidator');
const {
  uploadDermatologistImage,
  resizeDermatologistImage,
  getDermatologists,
  createDermatologist,
  getDermatologist,
  updateDermatologist,
  deleteDermatologist,
  updateLoggedDermatologistData,
} = require('../controllers/dermatologistController');
const {
  getAllReservations,
} = require('../controllers/doctorReservationController');
const {
  createFilterObj,
  changeUserPassword,
  updateLoggedUserPassword,
  deleteLoggedUserData,
  getLoggedUserData,
} = require('../controllers/handlersFactory');
const report = require('../controllers/reportController');
const { getRequestedTests } = require('../controllers/requestedTestController');
const Dermatologist = require('../models/dermatologistModel');
const authController = require('../controllers/authController');
const { resizeImage } = require('../controllers/resizeImgController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
// dermatologist routes
router.get(
  '/getMe',
  authController.allowedTo('dermatologist'),
  getLoggedUserData,
  getDermatologist,
);
router.put(
  '/changeMyPassword',
  authController.allowedTo('dermatologist'),
  updateLoggedUserPassword(Dermatologist),
);
router.put(
  '/updateMe',
  authController.allowedTo('dermatologist'),
  uploadDermatologistImage,
  resizeDermatologistImage,
  updateLoggedDermatologistValidator,
  updateLoggedDermatologistData,
);
router.delete(
  '/deleteMe',
  authController.allowedTo('dermatologist'),
  deleteLoggedUserData(Dermatologist),
);

// nested Route
router.route('/Dermatologist-reservation').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'dermatologist');
  },
  authController.allowedTo('dermatologist'),
  getAllReservations,
);

router.route('/reports').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'dermatologist');
  },
  authController.protect,
  authController.allowedTo('dermatologist'),
  report.getReports,
);

//  admin

router
  .route('/')
  .get(
    authController.protect,
    authController.allowedTo('admin', 'patient'),
    getDermatologists,
  );
// .post( authController.protect,authController.allowedTo("admin"),uploadDermatologistImage,resizeDermatologistImage,createDermatologistValidator,createDermatologist);

router
  .route('/:id')
  //getDermatologistValidator validation layer  rule call validator
  .get(authController.protect, getDermatologistValidator, getDermatologist)
  .put(
    authController.protect,
    authController.allowedTo('admin'),
    uploadDermatologistImage,
    resizeDermatologistImage,
    updateDermatologistValidator,
    updateDermatologist,
  )
  .delete(
    authController.protect,
    authController.allowedTo('admin'),
    deleteDermatologistValidator,
    deleteDermatologist,
  );

// router.route('/:id/requested-tests').get((req, res, next) => {
//   createFilterObj(req, res, next, 'dermatologist');
// }, getRequestedTests);

router.put(
  '/changePassword/:id',
  authController.protect,
  authController.allowedTo('admin'),
  changedermatologistPasswordValidator,
  changeUserPassword(Dermatologist),
);

module.exports = router;
