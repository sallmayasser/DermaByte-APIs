const { check } = require('express-validator');
const moment = require('moment');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const doctorScheduleModel = require('../../models/doctorScheduleModel');

exports.createScheduleValidator = [
  check('day')
    .notEmpty()
    .withMessage(' Day is required')
    .custom(async (value, { req }) => {
      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const dayindex = moment([
        moment(value).year(),
        moment(value).month(),
        moment(value).date(),
      ]).day();
      const dayName = weekdays[dayindex];
      const enteredMonth = moment(value).month();

      const existingDay = await doctorScheduleModel.find({
        dayName: dayName,
        dermatologist: req.body.dermatologist,
      })
      const foundDay = existingDay.map((monthindex) => monthindex.dayName);
      const foundMonth = existingDay.map((monthindex) => monthindex.day);
      const isFoundMonth = foundMonth.some(
        (x) => moment(x).month() === enteredMonth,
      );
      const isFoundDay = foundDay.some(
        (x) => x === dayName,
      );
      if (isFoundDay && isFoundMonth) {
        throw new Error(
          'You have already add this day Schedule for the Same month',
        );
      }
      return true; // Return true if the validation passes
    }),
  check('startTime').notEmpty().withMessage(' start time is required'),
  check('endTime').notEmpty().withMessage(' end Time is required'),
  check('sessionTime').notEmpty().withMessage(' session Time is required'),
  check('sessionCost')
    .notEmpty()
    .withMessage('session price must not be empty'),
  check('dermatologist').notEmpty().withMessage('dermatologist id is required'),
  validatorMiddleware,
];

exports.getScheduleValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateScheduleValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),

  validatorMiddleware,
];

exports.deleteScheduleValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
