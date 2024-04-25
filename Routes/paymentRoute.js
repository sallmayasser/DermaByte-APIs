const express = require('express');
const { checkoutSession } = require('../controllers/paymentController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/checkout-session',
    authController.protect,
    authController.allowedTo('patient'),
    checkoutSession
);

module.exports = router;
