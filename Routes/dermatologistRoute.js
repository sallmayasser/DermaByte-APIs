const express = require('express');
const {
  getDermatologistValidator,
  createDermatologistValidator,
  updateDermatologistValidator,
  deleteDermatologistValidator,
} = require('../utils/validators/dermatologistValidator');
const {
  getDermatologists,
  createDermatologist,
  getDermatologist,
  updateDermatologist,
  deleteDermatologist,
} = require('../controllers/dermatologistController');
const {
  getAllReservations,
} = require('../controllers/doctorReservationController');
const { createFilterObj } = require('../controllers/handlersFactory');
// const patientRoute= require ("./patientRoutes")

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getDermatologists)
  .post(createDermatologistValidator, createDermatologist);

router
  .route('/:id')
  //getDermatologistValidator validation layer  rule call validator
  .get(getDermatologistValidator, getDermatologist)
  .put(updateDermatologistValidator, updateDermatologist)
  .delete(deleteDermatologistValidator, deleteDermatologist);

router.route('/:id/Dermatologist-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'dermatologist');
}, getAllReservations);

module.exports = router;
