const express = require('express');
const functions = require('../controllers/doctorReservationController');
const validators = require('../utils/validators/ReservationsValidator');
const {
  createReportValidator,
} = require('../utils/validators/reportValidator');
const { createFilterObj } = require('../controllers/handlersFactory');
const authController = require('../controllers/authController');
const { createReport } = require('../controllers/reportController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    authController.allowedTo('patient'),
    functions.uploadUploadedTestImages,
    functions.resizeUploadedTestImages,
    functions.setPatientIdToBody,
    createReportValidator,
    createReport,
    validators.createReservationValidator,
    functions.createReservation,
 
  )
  .get(
    authController.protect,
    authController.allowedTo('admin'),
    functions.getAllReservations,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.allowedTo('admin', 'patient', 'dermatologist'),
    validators.getReservationValidator,
    functions.getReservation,
  )
  .put(
    authController.protect,
    authController.allowedTo('patient'),
    functions.uploadUploadedTestImages,
    functions.resizeUploadedTestImages,
    validators.updateReservationValidator,
    functions.updateReservation,
  )
  .delete(
    authController.protect,
    authController.allowedTo('patient'),
    validators.deleteReservationValidator,
    createFilterObj,
    functions.deleteReservation,
  );

module.exports = router;
