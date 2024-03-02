const Report = require('../models/reportModel');
const factory = require('./handlersFactory');

exports.getReports = factory.getAll(Report);
exports.getReport = factory.getOne(Report, 'ReqTests');
exports.createReport = factory.createOne(Report);
exports.updateReport = factory.updateOne(Report);
exports.appendReport = factory.AppendOne(Report);
exports.deleteReport = factory.deleteOne(Report);
