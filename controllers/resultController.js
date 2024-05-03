const expressAsyncHandler = require('express-async-handler');
const Result = require('../models/resultModel');
const factory = require('./handlersFactory');

exports.getResults = factory.getAll(Result);
exports.getResult = factory.getOne(Result);
exports.createResult = expressAsyncHandler(async (req, res) => {
  const newDoc = await Result.create(req.body);
  return newDoc;
});
exports.updateResult = factory.updateOne(Result);
exports.deleteResult = factory.deleteOne(Result);
exports.setLabIdToBody = (req, res, next) => {
  //nested route {create}
  if (!req.body.lab) req.body.lab = req.params.id;
  next();
};
