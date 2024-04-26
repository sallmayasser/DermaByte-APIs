const express = require('express');
const {
  checkoutSession,
  checkoutSessionLab,
} = require('../controllers/paymentController');
const authController = require('../controllers/authController');
const functions = require('../controllers/doctorReservationController');
const {
  createFilterObj,
  getLoggedUserData,
} = require('../controllers/handlersFactory');
const validators = require('../utils/validators/ReservationsValidator');

const router = express.Router();

router.get(
  '/checkout-session',
  authController.protect,
  authController.allowedTo('patient'),
  getLoggedUserData,
  functions.uploadUploadedTestImages,
  functions.resizeUploadedTestImages,
  functions.setPatientIdToBody,
  validators.createReservationValidator,
  checkoutSession,
);

router.get(
  '/checkout-session/lab',
  authController.protect,
  authController.allowedTo('patient'),
  getLoggedUserData,
  functions.setPatientIdToBody,
  validators.createLabReservationValidator,
  checkoutSessionLab,
);
module.exports = router;
