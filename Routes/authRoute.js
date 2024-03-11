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
const admin = require('../models/AdminModel');

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
const { resizeImage, uploadImage } = require('../controllers/imageController');
const {
  uploadSingleImage,
  uploadMixOfImages,
} = require('../middleware/uploadImageMiddleware');
const validateMiddleware = require('../middleware/newValidatorMiddleware');

const router = express.Router();

// router.post(
//   '/signup/admin',
//   signup(admin),
// );

router.post(
  '/signup',
  uploadImage,
  resizeImage,
  validateMiddleware,
  (req, res,next) => { checkRole(req , res, next)}
);

router.post('/login', loginValidator, login);

router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);

module.exports = router;
