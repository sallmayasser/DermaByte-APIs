const express = require('express');
const path = require('path');
const {
  checkoutSession,
  checkoutSessionLab,
} = require('../controllers/paymentController');
const authController = require('../controllers/authController');
const functions = require('../controllers/doctorReservationController');
const {
  getLoggedUserData,
} = require('../controllers/handlersFactory');
const validators = require('../utils/validators/ReservationsValidator');
const { uploadImage, resizeImage } = require('../controllers/imageController');
const { setPatientToBody } = require("../controllers/patientController")

const router = express.Router();

router.get(
  '/checkout-session',
  authController.protect,
  authController.allowedTo('patient'),
  getLoggedUserData,
  uploadImage,
  setPatientToBody,
  resizeImage,
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
router.get('/payment-successfully', (req, res) => {
 const filePath = path.join(__dirname, '../utils/success.html');
  res.sendFile(filePath);
});
router.get('/payment-rejected', (req, res) => {
  const filePath = path.join(__dirname, '../utils/cancel.html');
  res.sendFile(filePath);
});
module.exports = router;