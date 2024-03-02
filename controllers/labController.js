const Lab = require('../models/labModel')
const factory = require('./handlersFactory');


exports.getLabs = factory.getAll(Lab,'Services',"Lab");
exports.getLab = factory.getOne(Lab,'Services');
exports.createLab = factory.createOne(Lab);
exports.updateLab = factory.updateOne(Lab);
exports.deleteLab = factory.deleteOne(Lab);