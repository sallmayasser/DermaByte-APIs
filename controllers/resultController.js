const Result = require('../models/resultModel')
const factory = require('./handlersFactory');


exports.getResults = factory.getAll(Result);
exports.getResult = factory.getOne(Result);
exports.createResult = factory.createOne(Result);
exports.updateResult = factory.updateOne(Result);
exports.deleteResult = factory.deleteOne(Result);