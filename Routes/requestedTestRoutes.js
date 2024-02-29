const express = require('express');
const functions = require('../controllers/requestedTestController');
const validators = require('../utils/validators/requestedTestValidator');
const { createFilterObj } = require('../controllers/handlersFactory');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(functions.createRequestedTest, validators.createRequestedTestValidator)
  .get(functions.getRequestedTests);

router
  .route('/:id')
  .get(validators.getRequestedTestValidator, functions.getRequestedTest)
  .put(
    validators.updateRequestedTestValidator,
    functions.updateRequestedTest,
    functions.setPatientIdToBody,
  )
  .post(functions.createRequestedTest, validators.createRequestedTestValidator)
  .delete(
    validators.deleteRequestedTestValidator,
    createFilterObj,
    functions.deleteRequestedTest,
  );

module.exports = router;
