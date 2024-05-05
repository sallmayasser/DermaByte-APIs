const express = require('express');
const { loginValidator } = require('../utils/validators/authValidator');
const {
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  checkRole,
  logout,
} = require('../controllers/authController');
const { resizeImage, uploadImage } = require('../controllers/imageController');
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
  (req, res, next) => {
    checkRole(req, res, next);
  },
);

router.post('/login', loginValidator, login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);

module.exports = router;
