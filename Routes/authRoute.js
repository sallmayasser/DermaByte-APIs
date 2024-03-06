const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { loginValidator } = require('../utils/validators/authValidator');
const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  checkRole,
} = require('../controllers/authController');
const patient = require('../models/patientModel');
const dermatologist = require('../models/dermatologistModel');
const lab = require('../models/labModel');
const {
  createPatientValidator, createValidator,
} = require('../utils/validators/patientValidator');
const {
  createDermatologistValidator,
} = require('../utils/validators/dermatologistValidator');
const { createLabValidator } = require('../utils/validators/labValidator');
const {
  uploadPatientImage,
  resizePatientImage,
} = require('../controllers/patientController');
const {
  uploadDermatologistImage,
  resizeDermatologistImage,
} = require('../controllers/dermatologistController');
const {
  resizeLabImage,
  uploadLabImage,
} = require('../controllers/labController');
const { resizeImage } = require('../controllers/resizeImgController');
const {
  uploadSingleImage,
  uploadMixOfImages,
} = require('../middleware/uploadImageMiddleware');

const router = express.Router();

router.post(
  '/signup/patient',
  uploadPatientImage,
  resizePatientImage,
  createPatientValidator,
  signup(patient),
);

router.post(
  '/signup/dermatologist',
  uploadDermatologistImage,
  resizeDermatologistImage,
  createDermatologistValidator,
  signup(dermatologist),
);

router.post(
  '/signup/lab',
  uploadLabImage,
  resizeLabImage,
  createLabValidator,
  signup(lab),
);

// router.post(
//   '/signup',
//   (req, res, next) => {
//     console.log(req.body);
//     next();
//   },
//   uploadPatientImage,
//   resizeImage,
//   (req, res, next) => {
//     console.log(req.body);
//     next();
//   },
//   createValidator,
//   checkRole,
// );

router.post('/login', loginValidator, login);

// router.post('/forgotPassword', forgotPassword);
// router.post('/verifyResetCode', verifyPassResetCode);
// router.put('/resetPassword', resetPassword);

module.exports = router;
