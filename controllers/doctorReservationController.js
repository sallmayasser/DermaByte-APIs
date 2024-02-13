const handlers = require('./handlersFactory');
const Reservation = require('../models/doctorReservationModel');

exports.getAllReservations = handlers.getAll(Reservation);

exports.getReservation = handlers.getOne(Reservation);

exports.updateReservation = handlers.updateOne(Reservation);

exports.deleteReservation = handlers.deleteOne(Reservation);

exports.createReservation = handlers.createOne(Reservation);

// Nested route
// GET /api/v1/patients/:patientId/Dermatologist-reservation
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.id) filterObject = { patient: req.params.id };
  req.filterObj = filterObject;
  console.log(filterObject);
  next();
};

exports.createDermatologistFilter = (req, res, next) => {
  let filterObject = {};
  if (req.params.id) filterObject = { dermatologist: req.params.id };
  req.filterObj = filterObject;
  console.log(filterObject);
  next();
};

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.patientId;
  next();
};
