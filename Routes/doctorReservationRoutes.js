const express = require('express');
const functions = require('../controllers/doctorReservationController');
const validators = require('../utils/validators/doctorReservationValidator');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    functions.setPatientIdToBody,
    functions.createReservation,
    validators.createReservationValidator,
  )
  .get(functions.createFilterObj, functions.getAllReservations);

router
  .route('/:id')
  // .get(validators.getReservationValidator, functions.getReservation)
  .put(validators.updateReservationValidator, functions.updateReservation)
  .delete(
    validators.deleteReservationValidator,
    functions.createFilterObj,
    functions.deleteReservation,
  );

module.exports = router;
