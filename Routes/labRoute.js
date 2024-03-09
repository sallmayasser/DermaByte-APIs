const express = require('express');
const {
  getLabValidator,
  createLabValidator,
  updateLabValidator,
  deleteLabValidator,
  changelabPasswordValidator,
  updateLoggedlabValidator,
} = require('../utils/validators/labValidator');
const {
  uploadLabImage,
  resizeLabImage,
  getLabs,
  createLab,
  getLab,
  updateLab,
  deleteLab,
  updateLoggedLabData,
} = require('../controllers/labController');
const testServiceRoute = require('./testServiceRoute');
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
const { resizeImage } = require('../controllers/resizeImgController');

const router = express.Router();

router.use('/:labId/tests', testServiceRoute);

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
  uploadLabImage,
  resizeImage,
  updateLoggedlabValidator,
  updateLoggedLabData,
);
router.delete(
  '/deleteMe',
  authController.allowedTo('lab'),
  deleteLoggedUserData(lab),
);
router
  .route('/')
  .get(authController.protect, authController.allowedTo('admin',"patient"), getLabs);
// .post(authController.protect,authController.allowedTo(""),uploadLabImage, resizeLabImage, createLabValidator, createLab);

router
  .route('/:id')
  //getLabValidator validation layer  rule call validator
  .get(authController.protect, getLabValidator, getLab)
  .put(
    authController.protect,
    authController.allowedTo('admin'),
    uploadLabImage,
    resizeLabImage,
    updateLabValidator,
    updateLab,
  )
  .delete(
    authController.protect,
    authController.allowedTo('admin'),
    deleteLabValidator,
    deleteLab,
  );

// nested Routes
router.route('/:id/laboratory-reservation').get(
  (req, res, next) => {
    createFilterObj(req, res, next, 'lab');
  },
  authController.protect,
  authController.allowedTo('lab'),
  getAllReservations,
);
router.route('/:id/results').get(
  (req, res, next) => {
    createFilterObj(req, res, next, 'lab');
  },
  authController.protect,
  authController.allowedTo('lab'),
  result.getResults,
);

router.put(
  '/changePassword/:id',
  authController.protect,
  authController.allowedTo('lab'),
  changelabPasswordValidator,
  changeUserPassword(lab),
);
module.exports = router;
