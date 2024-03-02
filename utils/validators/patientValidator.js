const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Patient =require('../../models/patientModel')

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
    .isLength({ max: 99 })
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

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Patient.findOne({ email: val }).then((patient) => {
        if (patient) {
          return Promise.reject(new Error('E-mail already in patient'));
        }
      }),
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
];

exports.updatePatientValidator = [
  check('id').isMongoId().withMessage('Invalid Patient id format'),
  body('firstName')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Patient.findOne({ email: val }).then((patient) => {
        if (patient) {
          return Promise.reject(new Error('E-mail already in patient'));
        }
      }),
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];

exports.deletePatientValidator = [
  check('id').isMongoId().withMessage('Invalid Patient id format'),
  validatorMiddleware,
];
