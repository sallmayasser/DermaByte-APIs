const express = require('express');
const functions = require('../controllers/scansController');
const validators = require('../utils/validators/scanValidator');
const {
  createFilterObj,
  getLoggedUserData,
} = require('../controllers/handlersFactory');
const authController = require('../controllers/authController');
const { uploadImage, resizeImage } = require('../controllers/imageController');
const { setPatientToBody } = require('../controllers/patientController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    authController.allowedTo('patient'),
    getLoggedUserData,
    uploadImage,
    setPatientToBody,
    resizeImage,
    functions.setPatientIdToBody,
    validators.createScanValidator,
    functions.createScan,
  )
  .get(
    authController.protect,
    authController.allowedTo('admin'),
    functions.getScans,
  );

router
  .route('/:id')
  .get(authController.protect, validators.getScanValidator, functions.getScan)

  .delete(
    authController.protect,
    authController.allowedTo('patient'),
    validators.deleteScanValidator,
    createFilterObj,
    functions.deleteScan,
  );

module.exports = router;
