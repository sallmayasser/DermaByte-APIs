const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const doctorScheduleModel = require('../../models/doctorScheduleModel');

exports.createScheduleValidator = [
  check('day')
    .notEmpty()
    .withMessage(' Day is required')
    .custom(async (value, { req }) => {
      const existingDay = await doctorScheduleModel.find({
        day: value,
        dermatologist: req.body.dermatologist,
      });
      if (existingDay.length !== 0) {
        throw new Error('You have already add this day Schedule');
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
