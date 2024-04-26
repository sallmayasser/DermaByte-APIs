const express = require('express');
const {
  getDermatologistValidator,
  updateDermatologistValidator,
  deleteDermatologistValidator,
  changedermatologistPasswordValidator,
  updateLoggedDermatologistValidator,
} = require('../utils/validators/dermatologistValidator');
const { resizeImage, uploadImage } = require('../controllers/imageController');
const {
  getDermatologists,
  getDermatologist,
  updateDermatologist,
  deleteDermatologist,
  updateLoggedDermatologistData,
  setDermatologistToBody,
} = require('../controllers/dermatologistController');
const {
  getAllReservations,
} = require('../controllers/doctorReservationController');
const { getReviews } = require('../controllers/reviewController');
const {
  createFilterObj,
  changeUserPassword,
  updateLoggedUserPassword,
  deleteLoggedUserData,
  getLoggedUserData,
} = require('../controllers/handlersFactory');
const report = require('../controllers/reportController');
const Dermatologist = require('../models/dermatologistModel');
const authController = require('../controllers/authController');
const { getSchedules, getFreeTimes, setDermatologistIdToBody,  } = require('../controllers/scheduleController');

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
  uploadImage,
  setDermatologistToBody,
  resizeImage,
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
router.route('/reviews').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'dermatologist');
  },
  authController.allowedTo('dermatologist'),
  getReviews,
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
router.route('/schedules').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'dermatologist');
  },
  authController.protect,
  authController.allowedTo('dermatologist'),
  getSchedules,
);
router.route('/myFreeTime').get(
  getLoggedUserData,
  setDermatologistIdToBody,
  authController.protect,
  authController.allowedTo('dermatologist'),
  getFreeTimes,
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
    uploadImage,
    resizeImage,
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
