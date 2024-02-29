const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createRequestedTestValidator = [
  check('patient').notEmpty().withMessage('patient is required'),
  check('dermatologist').notEmpty().withMessage('dermatologist is required'),
  validatorMiddleware,
];

exports.getRequestedTestValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateRequestedTestValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),

  validatorMiddleware,
];

exports.deleteRequestedTestValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
