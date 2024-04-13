const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const doctorReservationModel = require('../../models/doctorReservationModel');
const ApiError = require('../apiError');

exports.createReservationValidator = [
  check('date').notEmpty().withMessage('reservation date is required'),
  check('scan').custom(async (value, { req }) => {
    const existingReservation = await doctorReservationModel.find({
      scan: value,
      dermatologist: req.body.dermatologist,
    });
    if (existingReservation.length !== 0) {
      throw new Error(
        'You have already reserve with this dermatologist with same Scan',
      );
    }
    return true; // Return true if the validation passes
  }),

  validatorMiddleware,
];

exports.getReservationValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateReservationValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),

  validatorMiddleware,
];

exports.deleteReservationValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
