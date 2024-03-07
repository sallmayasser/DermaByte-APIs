const express = require('express');
const functions = require('../controllers/doctorReservationController');
const validators = require('../utils/validators/ReservationsValidator');
const { createFilterObj } = require('../controllers/handlersFactory');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authController.protect,authController.allowedTo("patient"),functions.uploadUploadedTestImages,functions.resizeUploadedTestImages,
    functions.setPatientIdToBody,
    functions.createReservation,
    validators.createReservationValidator,
  )
  .get(functions.getAllReservations);

router
  .route('/:id')
  .get(validators.getReservationValidator, functions.getReservation)
  .put(authController.protect,authController.allowedTo("patient"),functions.uploadUploadedTestImages,functions.resizeUploadedTestImages,validators.updateReservationValidator, functions.updateReservation)
  .delete(authController.protect,authController.allowedTo("patient"),
    validators.deleteReservationValidator,
    createFilterObj,
    functions.deleteReservation,
  );

module.exports = router;
