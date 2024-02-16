const Scans = require('../models/scansModel');
const factory = require('./handlersFactory');

exports.getScans = factory.getAll(Scans);
exports.getScan = factory.getOne(Scans);
exports.createScan = factory.createOne(Scans);
exports.deleteScan = factory.deleteOne(Scans);

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.patientId;
  next();
};