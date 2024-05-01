const express = require('express');
const functions = require('../controllers/doctorReservationController');
const validators = require('../utils/validators/ReservationsValidator');
const { createFilterObj } = require('../controllers/handlersFactory');
const authController = require('../controllers/authController');
const { uploadImage, resizeImage } = require('../controllers/imageController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  // .post(
  //   authController.protect,
  //   authController.allowedTo('patient'),
  //   getLoggedUserData,
  //   functions.uploadUploadedTestImages,
  //   functions.resizeUploadedTestImages,
  //   functions.setPatientIdToBody,
  //   validators.createReservationValidator,
  //   createReservation,
 
  // )
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
    authController.allowedTo('patient', 'dermatologist'),
    uploadImage,
    resizeImage,
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
