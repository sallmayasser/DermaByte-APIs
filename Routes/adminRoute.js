const express = require('express');
const authController = require('../controllers/authController');
const { Approve, Decline } = require('../controllers/adminController');

const router = express.Router({ mergeParams: true });

router
  .route('/Approve')
  .put(authController.protect, authController.allowedTo('admin'), Approve);
router
  .route('/Decline')
  .delete(authController.protect, authController.allowedTo('admin'), Decline);
module.exports = router;
