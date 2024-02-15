// const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getPatientValidator = [
  check('id').isMongoId().withMessage('Invalid Patient id format'),
  validatorMiddleware,
];

exports.createPatientValidator = [
  check('firstName')
    .notEmpty()
    .withMessage('Patient required')
    .isLength({ min: 2 })
    .withMessage('Too short Patient name')
    .isLength({ max: 32 })
    .withMessage('Too long Patient name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  
  check('LastName')
    .notEmpty()
    .withMessage('Patient required')
    .isLength({ min: 2 })
    .withMessage('Too short Patient name')
    .isLength({ max: 32 })
    .withMessage('Too long Patient name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  
  check('age')
    .notEmpty()
    .withMessage('Age is required')
    .isNumeric()
    .withMessage('age  must be a number')
    .isLength({ max: 99})
    .withMessage('age must be below or equal 99'),

  check('city')
    .notEmpty()
    .withMessage('city is required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  
  check('country')
    .notEmpty()
    .withMessage('country is required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updatePatientValidator = [
  check('id').isMongoId().withMessage('Invalid Patient id format'),
  body('firstName')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deletePatientValidator = [
  check('id').isMongoId().withMessage('Invalid Patient id format'),
  validatorMiddleware,
];
