const express = require('express');
const {
  getLabValidator,
  createLabValidator,
  updateLabValidator,
  deleteLabValidator,
  changelabPasswordValidator,
} = require('../utils/validators/labValidator');
const { uploadLabImage,
  resizeLabImage,
  getLabs,
  createLab,
  getLab,
  updateLab,
  deleteLab,
} = require('../controllers/labController');
const testServiceRoute = require('./testServiceRoute');
const {
  createFilterObj,
  changeUserPassword,
} = require('../controllers/handlersFactory');
const result = require('../controllers/resultController');
const {
  getAllReservations,
} = require('../controllers/labReservationController');
const lab = require('../models/labModel');
const authController = require('../controllers/authController');

const router = express.Router();

router.use('/:labId/tests', testServiceRoute);

router.route('/').get(authController.protect,authController.allowedTo("admin"),getLabs)
// .post(authController.protect,authController.allowedTo(""),uploadLabImage, resizeLabImage, createLabValidator, createLab);

router
  .route('/:id')
  //getLabValidator validation layer  rule call validator
  .get(authController.protect,getLabValidator, getLab)
  .put(authController.protect,authController.allowedTo("lab"),uploadLabImage, resizeLabImage, updateLabValidator, updateLab)
  .delete(authController.protect,authController.allowedTo("admin"),deleteLabValidator, deleteLab);

router.route('/:id/laboratory-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'lab');
}, authController.protect,authController.allowedTo("lab"),getAllReservations);
router.route('/:id/results').get((req, res, next) => {
  createFilterObj(req, res, next, 'lab');
},  authController.protect,authController.allowedTo("lab"),result.getResults);

router.put(
  '/changePassword/:id',
  authController.protect,authController.allowedTo("lab"),
  changelabPasswordValidator,
  changeUserPassword(lab),
);
module.exports = router;
