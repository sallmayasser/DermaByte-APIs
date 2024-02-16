const express = require('express');
const functions = require('../controllers/labReservationController');
const validators = require('../utils/validators/ReservationsValidator');
const { createFilterObj } = require('../controllers/handlersFactory');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    functions.setPatientIdToBody,
    functions.createReservation,
    validators.createReservationValidator,
  )
  .get(functions.getAllReservations);

router
  .route('/:id')
  .get(validators.getReservationValidator, functions.getReservation)
  .put(validators.updateReservationValidator, functions.updateReservation)
  .delete(
    validators.deleteReservationValidator,
    createFilterObj,
    functions.deleteReservation,
  );

module.exports = router;
