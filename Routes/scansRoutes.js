const express = require('express');
const functions = require('../controllers/scansController');
const validators = require('../utils/validators/scanValidator');
const { createFilterObj } = require('../controllers/handlersFactory');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(functions.setPatientIdToBody, functions.createScan)
  .get(functions.getScans);

router
  .route('/:id')
  .get(validators.getScanValidator, functions.getScan)

  .delete(
    validators.deleteScanValidator,
    createFilterObj,
    functions.deleteScan,
  );

module.exports = router;
