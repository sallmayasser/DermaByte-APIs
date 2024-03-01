const handlers = require('./handlersFactory');
const Patient = require('../models/patientModel');

exports.getAllPatients = handlers.getAll(Patient);

exports.getPatient = handlers.getOne(Patient);

exports.updatePatient = handlers.updateOne(Patient);

exports.deletePatient = handlers.deleteOne(Patient);

exports.createPatient = handlers.createOne(Patient);

