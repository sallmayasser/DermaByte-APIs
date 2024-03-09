const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Lab = require('../../models/labModel');

exports.createLabValidator = [
  check('firstName')
    .isLength({ min: 2 })
    .withMessage('must be at least 2 chars')
    .isLength({ max: 32 })
    .withMessage('must be at least 2 chars')
    .notEmpty()
    .withMessage('name is required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('location').optional(),
  check('city').notEmpty().withMessage('city is required'),
  check('country').notEmpty().withMessage('city is required'),
  check('license').notEmpty(),
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Lab.findOne({ email: val }).then((lab) => {
        if (lab) {
          return Promise.reject(new Error('E-mail already in lab'));
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
  validatorMiddleware,
];

exports.getLabValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateLabValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Lab.findOne({ email: val }).then((lab) => {
        if (lab) {
          return Promise.reject(new Error('E-mail already in lab'));
        }
      }),
    ),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  validatorMiddleware,
];

exports.deleteLabValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.changelabPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid lab id format'),
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
      const lab = await Lab.findById(req.params.id);
      if (!lab) {
        throw new Error('There is no lab for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        lab.password,
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
