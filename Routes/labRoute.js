const express = require('express');
const {
  getLabValidator,
  updateLabValidator,
  deleteLabValidator,
  changelabPasswordValidator,
  updateLoggedlabValidator,
} = require('../utils/validators/labValidator');
const {
  getLabs,
  getLab,
  updateLab,
  deleteLab,
  updateLoggedLabData,
} = require('../controllers/labController');

const {
  createFilterObj,
  changeUserPassword,
  deleteLoggedUserData,
  getLoggedUserData,
  updateLoggedUserPassword,
} = require('../controllers/handlersFactory');
const result = require('../controllers/resultController');
const {
  getAllReservations,
} = require('../controllers/labReservationController');
const lab = require('../models/labModel');
const authController = require('../controllers/authController');
const { resizeImage, uploadImage } = require('../controllers/imageController');
const {
  getTestServices,
  setLabIdToBody,
  createTestService,

} = require('../controllers/testServiceController');
const {
  createTestServiceValidator,

} = require('../utils/validators/testServiceValidator');
const {
  getReviews,
} = require('../controllers/reviewController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/getMe',
  authController.allowedTo('lab'),
  getLoggedUserData,
  getLab,
);
router.put(
  '/changeMyPassword',
  authController.allowedTo('lab'),
  updateLoggedUserPassword(lab),
);
router.put(
  '/updateMe',
  authController.allowedTo('lab'),
  uploadImage,
  resizeImage,
  updateLoggedlabValidator,
  updateLoggedLabData,
);
router.delete(
  '/deleteMe',
  authController.allowedTo('lab'),
  deleteLoggedUserData(lab),
);
// nested Routes
router.route('/laboratory-reservation').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'lab');
  },
  authController.allowedTo('lab'),
  getAllReservations,
);
router.route('/reviews').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'lab');
  },
  authController.allowedTo('lab'),
  getReviews,
);
router.route('/results').get(
  getLoggedUserData,
  (req, res, next) => {
    createFilterObj(req, res, next, 'lab');
  },
  authController.allowedTo('lab'),
  result.getResults,
);

router
  .route('/tests')
  .get(
    getLoggedUserData,
    (req, res, next) => {
      createFilterObj(req, res, next, 'lab');
    },
    authController.allowedTo('lab'),
    getTestServices,
  )
  .post(

    authController.allowedTo('lab'),
    getLoggedUserData,
    setLabIdToBody,
    createTestServiceValidator,
    createTestService,
  )
  

// admin routes
router
  .route('/')
  .get(
    authController.protect,
    authController.allowedTo('admin', 'patient'),
    getLabs,
  );
// .post(authController.protect,authController.allowedTo(""),uploadLabImage, resizeLabImage, createLabValidator, createLab);

router
  .route('/:id')
  //getLabValidator validation layer  rule call validator
  .get(authController.protect, getLabValidator, getLab)
  .put(
    authController.protect,
    authController.allowedTo('admin'),
    uploadImage,
    resizeImage,
    updateLabValidator,
    updateLab,
  )
  .delete(
    authController.protect,
    authController.allowedTo('admin'),
    deleteLabValidator,
    deleteLab,
  );

router.put(
  '/changePassword/:id',
  authController.protect,
  authController.allowedTo('admin'),
  changelabPasswordValidator,
  changeUserPassword(lab),
);
module.exports = router;
