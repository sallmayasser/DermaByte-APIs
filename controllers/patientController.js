const handlers = require('./handlersFactory');
const Patient = require('../models/patientModel');

exports.getAllPatients = handlers.getAll(Patient);

exports.getPatient = handlers.getOne(Patient ,{ path: 'reservations', select: 'dermatologist -patient -_id' } );

exports.updatePatient = handlers.updateOne(Patient);

exports.deletePatient = handlers.deleteOne(Patient);

exports.createPatient = handlers.createOne(Patient);

