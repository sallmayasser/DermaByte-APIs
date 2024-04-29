const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.createScanValidator = [
  check('diseasePhoto').notEmpty().withMessage('Please upload image first'),
  check('patient').notEmpty().withMessage('Please enter the patient id '),
  validatorMiddleware,
];
exports.getScanValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.deleteScanValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
