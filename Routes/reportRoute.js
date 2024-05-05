const express = require('express');
const formidable = require('formidable');
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
  // .post(
  //   authController.protect,
  //   authController.allowedTo('dermatologist', 'patient'),
  //   createReportValidator,
  //   createReport,
  // );

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
router.route('/:id/uploadTestResult').put(
  authController.protect,
  authController.allowedTo('patient'),
  setPatientToBody,
  (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        res.status(500).send('Error parsing form data');
        return;
      }
      // req.body.patient = fields.patient[0];
      req.files = { uploadedTest: files };
      next();
    });
  },
  resizeImage,
  updateUploadedTestValidator,
  updateReport,
);
module.exports = router;
