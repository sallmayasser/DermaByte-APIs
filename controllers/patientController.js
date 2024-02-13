const handlers = require('./handlersFactory');
const Patient = require('../models/patientModel');

// exports.createFilterObj =(req,res,next) => {
//     let filterObject ={};
// if(req.params.dermatologistId) filterObject={dermatologist: req.params.dermatologistId};
// req.filterObj=filterObject;
// next();}

exports.getAllPatients = handlers.getAll(Patient);

exports.getPatient = handlers.getOne(Patient
    // ,"dermatologists"
    );

exports.updatePatient = handlers.updateOne(Patient);

exports.deletePatient = handlers.deleteOne(Patient);

exports.createPatient = handlers.createOne(Patient);

