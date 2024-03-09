const express = require('express');
const authController = require('../controllers/authController');
const { Approve } = require('../controllers/adminController');

const router = express.Router({ mergeParams: true });

router
  .route('/Approve')
  .put(
    authController.protect,
    authController.allowedTo('admin'),
    Approve,
  );
  
module.exports = router;
