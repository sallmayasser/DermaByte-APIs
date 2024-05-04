const express = require('express');
const {
  getReportValidator,
  createReportValidator,
  updateReportValidator,
  deleteReportValidator,
  updateUploadedTestValidator,
} = require('../utils/validators/reportValidator');

const {
  getReports,
  createReport,
  getReport,
  updateReport,
  deleteReport,
  appendReport,
  deleteRequestedTest,
} = require('../controllers/reportController');
const authController = require('../controllers/authController');
const { getLoggedUserData } = require('../controllers/handlersFactory');
const { uploadImage, resizeImage } = require('../controllers/imageController');
const { setPatientToBody } = require('../controllers/patientController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, authController.allowedTo('admin'), getReports)
  .post(
    authController.protect,
    authController.allowedTo('dermatologist', 'patient'),
    createReportValidator,
    createReport,
  );

router
  .route('/:id')
  //getReportValidator validation layer  rule call validator
  .get(authController.protect, getReportValidator, getReport)
  .put(
    authController.protect,
    authController.allowedTo('dermatologist', 'patient'),
    updateReportValidator,
    updateReport,
  )
  .delete(
    authController.protect,
    authController.allowedTo('admin'),
    deleteReportValidator,
    deleteReport,
  );
router
  .route('/:id/test')
  .put(
    authController.protect,
    authController.allowedTo('dermatologist'),
    updateReportValidator,
    appendReport,
  );
router
  .route('/:reportId/tests/:testId')
  .delete(
    authController.protect,
    authController.allowedTo('dermatologist'),
    deleteRequestedTest,
  );
router
  .route('/:id/uploadTestResult')
  .put(
    authController.protect,
    authController.allowedTo('patient'),
    uploadImage,
    setPatientToBody,
    resizeImage,
    updateUploadedTestValidator,
    updateReport,
  );
module.exports = router;
