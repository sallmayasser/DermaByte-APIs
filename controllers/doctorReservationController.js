const handlers = require('./handlersFactory');
const Reservation = require('../models/doctorReservationModel');

exports.getAllReservations = handlers.getAll(Reservation, "Report");

exports.getReservation = handlers.getOne(Reservation, 'Report');

exports.updateReservation = handlers.updateOne(Reservation);

exports.deleteReservation = handlers.deleteOne(Reservation);

// Nested route
// GET /api/v1/patients/:patientId/Dermatologist-reservation
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.id) filterObject = { patient: req.params.id };
  req.filterObj = filterObject;
  next();
};

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.id;
  next();
};
