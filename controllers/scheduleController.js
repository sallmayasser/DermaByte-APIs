const asyncHandler = require('express-async-handler');
const moment = require('moment');
const Schedule = require('../models/doctorScheduleModel');
const factory = require('./handlersFactory');
const doctorScheduleModel = require('../models/doctorScheduleModel');
const doctorReservationModel = require('../models/doctorReservationModel');
const { divideTimeRange } = require('./divideTime');
const ApiError = require('../utils/apiError');

exports.getSchedules = factory.getAll(Schedule);
exports.getSchedule = factory.getOne(Schedule);
exports.setDermatologistIdToBody = (req, res, next) => {
  //nested route {create}
  if (!req.body.dermatologist) req.body.dermatologist = req.params.id;
  next();
};

exports.createSchedule = asyncHandler(async (req, res, next) => {
  const { sessionCost } = req.body;
  const dermatologist = req.user._id;

  if (sessionCost == null || dermatologist == null) {
    return next(
      new ApiError('Session cost and dermatologist must be provided', 400),
    );
  }

  const newDoc = await Schedule.create({
    ...req.body,
    dermatologist: dermatologist,
  });
  const updateResult = await Schedule.updateMany(
    { dermatologist },
    { sessionCost },
  );

  if (updateResult.modifiedCount === 0) {
    return next(new ApiError('No documents were updated', 404));
  }

  res.status(201).json({ data: newDoc });
});


exports.updateSchedule = asyncHandler(async (req, res, next) => {
  if (req.body.updateAll) {
    const { sessionCost } = req.body;
    const dermatologist = req.user._id;

    if (sessionCost == null || dermatologist == null) {
      return next(
        new ApiError(
          'Session cost must be provided to update all schedules',
          400,
        ),
      );
    }
    const result = await Schedule.updateMany(
      { dermatologist },
      { sessionCost },
    );

    if (result.modifiedCount === 0) {
      return next(new ApiError('No documents were updated', 404));
    }
    return res.status(200).json({
      message: `Updated ${result.modifiedCount} schedules with new session cost`,
    });
  }

  // Update a specific schedule by ID
  const document = await Schedule.findByIdAndUpdate(
    req.params.id,
    {
      dayName: req.body.dayName,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      sessionTime: req.body.sessionTime,
      sessionCost: req.body.sessionCost,
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(
      new ApiError(`No document found for this id ${req.params.id}`, 404),
    );
  }

  // Trigger "save" event when updating the document
  await document.save();
  res.status(200).json({ data: document });
});

exports.deleteSchedule = factory.deleteOne(Schedule);

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
