const asyncHandler = require('express-async-handler');
const moment = require('moment');
const Schedule = require('../models/doctorScheduleModel');
const factory = require('./handlersFactory');
const doctorScheduleModel = require('../models/doctorScheduleModel');
const doctorReservationModel = require('../models/doctorReservationModel');
const { divideTimeRange } = require('./divideTime');

exports.getSchedules = factory.getAll(Schedule);
exports.getSchedule = factory.getOne(Schedule);
exports.setDermatologistIdToBody = (req, res, next) => {
  //nested route {create}
  if (!req.body.dermatologist) req.body.dermatologist = req.params.id;
  next();
};
exports.createSchedule = factory.createOne(Schedule);
exports.updateSchedule = factory.updateOne(Schedule);
exports.deleteSchedule = factory.deleteOne(Schedule);
// exports.reserve = (req, res) => {};
exports.getFreeTimes = asyncHandler(async (req, res, next) => {
  const schedules = await doctorScheduleModel.find({
    dermatologist: req.body.dermatologist,
  });
  const dermatologist = await doctorReservationModel
    .find({
      dermatologist: req.body.dermatologist,
    })
    .select('date');
  const reservedSessions = dermatologist.map((reservation) => reservation.date);

  const currentMonth = moment();
  const nextMonth = moment().add(1, 'month').startOf('month');
  // const freeTime = divideTimeRange(reservedSessions, schedules,moment('2024-02-01T10:00:00.000Z'));
  const freeTime = divideTimeRange(reservedSessions, schedules, currentMonth);
  const freeTimeNextMonth = divideTimeRange(
    reservedSessions,
    schedules,
    nextMonth,
  );
  const allFreeTimes = [...freeTime, ...freeTimeNextMonth];
  res.status(201).json({ data: allFreeTimes });
});
