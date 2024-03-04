const express = require('express');
const {getDermatologistValidator,createDermatologistValidator,updateDermatologistValidator,deleteDermatologistValidator, changedermatologistPasswordValidator,} = require('../utils/validators/dermatologistValidator');
const {uploadDermatologistImage,resizeDermatologistImage,getDermatologists,createDermatologist,getDermatologist,updateDermatologist,deleteDermatologist,} = require('../controllers/dermatologistController');
const { getAllReservations} = require('../controllers/doctorReservationController');
const {
  createFilterObj,
  changeUserPassword,
} = require('../controllers/handlersFactory');
const report = require('../controllers/reportController');
const { getRequestedTests } = require('../controllers/requestedTestController');
const Dermatologist = require('../models/dermatologistModel');

const router = express.Router({ mergeParams: true });

router.route('/').get(getDermatologists)
    .post( uploadDermatologistImage,resizeDermatologistImage,createDermatologistValidator,createDermatologist);

router
  .route('/:id')
  //getDermatologistValidator validation layer  rule call validator
  .get(getDermatologistValidator, getDermatologist)
  .put(updateDermatologistValidator, updateDermatologist)
  .delete(deleteDermatologistValidator, deleteDermatologist);

router.route('/:id/Dermatologist-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'dermatologist');
}, getAllReservations);


router.route('/:id/reports').get((req, res, next) => {
    createFilterObj(req, res, next, 'dermatologist');
}, report.getReports);
  

router.route('/:id/requested-tests').get((req, res, next) => {
  createFilterObj(req, res, next, 'dermatologist');
}, getRequestedTests);
  module.exports = router;
  
router.put(
  '/changePassword/:id',
  changedermatologistPasswordValidator,
  changeUserPassword(Dermatologist),
);


