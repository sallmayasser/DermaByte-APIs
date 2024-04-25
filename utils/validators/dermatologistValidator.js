const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Dermatologist = require('../../models/dermatologistModel');

exports.createDermatologistValidator = [
  check('firstName')
    .isLength({ min: 2 })
    .withMessage('must be at least 2 chars')
    .isLength({ max: 32 })
    .withMessage('must be at least 2 chars')
    .notEmpty()
    .withMessage('first name is required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('lastName')
    .isLength({ min: 2 })
    .withMessage('must be at least 2 chars')
    .isLength({ max: 32 })
    .withMessage('must be at least 2 chars')
    .notEmpty()
    .withMessage('last name is required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('location').optional(),

  check('city').notEmpty().withMessage('city is required'),

  check('country').notEmpty().withMessage('city is required'),

  check('specialization').optional(),

  check('license').notEmpty(),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Dermatologist.findOne({ email: val }).then((dermatologist) => {
        if (dermatologist) {
          return Promise.reject(new Error('E-mail already in dermatologist'));
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

  check('profilePic').optional(),
  check('sessionCost')
    .notEmpty()
    .withMessage('session price must not be empty')
    .isNumeric()
    .withMessage('cost must be numeric'),
    check('gender').custom((gender, { req }) => {
      if (req.gender === 'male' || req.gender === "female") {
         throw new Error('please enter male or female');
       }
       return true;
     }),
  // validatorMiddleware,
];

exports.getDermatologistValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateDermatologistValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Dermatologist.findOne({ email: val }).then((dermatologist) => {
        if (dermatologist) {
          return Promise.reject(new Error('E-mail already in dermatologist'));
        }
      }),
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];

exports.deleteDermatologistValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.changedermatologistPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid dermatologist id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const dermatologist = await Dermatologist.findById(req.params.id);
      if (!dermatologist) {
        throw new Error('There is no dermatologist for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        dermatologist.password,
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      if (val === req.body.currentPassword) {
        throw new Error('Please enter new password !');
      }
      return true;
    }),
  validatorMiddleware,
];
exports.updateLoggedDermatologistValidator = [

  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Dermatologist.findOne({ email: val }).then((dermatologist) => {
        if (dermatologist) {
          return Promise.reject(new Error('E-mail already in dermatologist'));
        }
      }),
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];