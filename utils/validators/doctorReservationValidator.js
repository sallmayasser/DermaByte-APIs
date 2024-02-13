const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createReservationValidator = [
  check('date').notEmpty().withMessage('reservation date is required'),

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
