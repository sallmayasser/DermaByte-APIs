const handlers = require('./handlersFactory');
const Reservation = require('../models/labReservationModel');

exports.getAllReservations = handlers.getAll(Reservation);

exports.getReservation = handlers.getOne(Reservation);

exports.updateReservation = handlers.updateOne(Reservation);

exports.deleteReservation = handlers.deleteOne(Reservation);

exports.createReservation = handlers.createOne(Reservation);

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.patientId;
  next();
};
