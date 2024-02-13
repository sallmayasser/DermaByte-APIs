const Dermatologist = require('../models/dermatologistModel')
const factory = require('./handlersFactory');


exports.getDermatologists = factory.getAll(Dermatologist);
exports.getDermatologist = factory.getOne(Dermatologist);
exports.createDermatologist = factory.createOne(Dermatologist);
exports.updateDermatologist = factory.updateOne(Dermatologist);
exports.deleteDermatologist = factory.deleteOne(Dermatologist);

