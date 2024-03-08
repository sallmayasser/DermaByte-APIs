const express = require('express');
const functions = require('../controllers/scansController');
const validators = require('../utils/validators/scanValidator');
const { createFilterObj } = require('../controllers/handlersFactory');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authController.protect,authController.allowedTo("patient"),functions.uploadScanImage,functions.resizeScanImage,functions.setPatientIdToBody, functions.createScan)
  .get( authController.protect,authController.allowedTo("admin"),functions.getScans);

router
  .route('/:id')
  .get(authController.protect,validators.getScanValidator, functions.getScan)

  .delete(
    authController.protect,authController.allowedTo("patient"),
    validators.deleteScanValidator,
    createFilterObj,
    functions.deleteScan,
  );

module.exports = router;
