const express = require('express');
const {
  getReportValidator,
  createReportValidator,
  updateReportValidator,
  deleteReportValidator,
} = require('../utils/validators/reportValidator');

const {
  getReports,
  createReport,
  getReport,
  updateReport,
  deleteReport,
  appendReport,
} = require('../controllers/reportController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(getReports).post(authController.protect,authController.allowedTo("dermatologist"),createReportValidator, createReport);

router
  .route('/:id')
  //getReportValidator validation layer  rule call validator
  .get(getReportValidator, getReport)
  .put(authController.protect,authController.allowedTo("dermatologist"),updateReportValidator, updateReport)
  .delete(authController.protect,authController.allowedTo("dermatologist"),deleteReportValidator, deleteReport);
router.route('/:id/test').put(updateReportValidator, appendReport);
module.exports = router;
