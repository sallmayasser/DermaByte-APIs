const expressAsyncHandler = require('express-async-handler');
const Report = require('../models/reportModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');

exports.getReports = factory.getAll(Report);
exports.getReport = factory.getOne(Report, 'ReqTests');
exports.createReport = factory.createOne(Report);
exports.updateReport = factory.updateOne(Report);
exports.appendReport = factory.AppendOne(Report);
exports.deleteReport = factory.deleteOne(Report);
exports.deleteRequestedTest = expressAsyncHandler(async (req, res, next) => {
  const { reportId, testId } = req.params;

  try {
    // Find the report by ID
    const report = await Report.findById(reportId);

    if (!report) {
     return  next(new ApiError('Report not found', 404));
    }

    // Find the index of the test to delete
    const testIndex = report.tests.findIndex((test) => test.id === testId);
    if (testIndex === -1) {
      return next(new ApiError('Test not found in the report', 404));
    }

    // Remove the test from the tests array
    report.tests.splice(testIndex, 1);

    // Save the updated report
    await report.save();

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    return next(new ApiError('Server Error', 500));
  }
});
