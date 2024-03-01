const RequestedTest = require('../models/requestedTestModel');
const factory = require('./handlersFactory');

exports.getRequestedTests = factory.getAll(RequestedTest);
exports.getRequestedTest = factory.getOne(RequestedTest,);
exports.createRequestedTest = factory.createOne(RequestedTest);
exports.updateRequestedTest = factory.updateOne(RequestedTest);
exports.deleteRequestedTest = factory.deleteOne(RequestedTest);


exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.patientId;
  next();
};
