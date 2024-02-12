
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.createDermatologistValidator = [
    check('firstName')
        .isLength({ min: 2 })
        .withMessage('must be at least 2 chars')
        .isLength({ max: 32 })
        .withMessage('must be at least 2 chars')
        .notEmpty()
        .withMessage('name is required'),
    check('lastName')
        .isLength({ min: 2 })
        .withMessage('must be at least 2 chars')
        .isLength({ max: 32 })
        .withMessage('must be at least 2 chars')
        .notEmpty()
        .withMessage('name is required'),
    check('mobile')
        .optional()
        .isLength({ min: 11 })
        .withMessage('must be at least 11 chars')
        .isLength({ max: 11 })
        .withMessage('must be below 11 chars'),
    check('location')
        .optional(),
    check('city')
        .notEmpty()
        .withMessage('city is required'),
    check('country')
        .notEmpty()
        .withMessage('city is required'),
    check('specialization')
        .optional(),
    check('license')
        .notEmpty(),
    check('email')
        .notEmpty()
        .withMessage('Please provide your email'),
    check('password')
        .notEmpty()
        .withMessage('Please provide your password')
        .isLength({ min: 8 })
        .withMessage('must be at least 8 chars'),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('Please confirm your password')
        .isLength({ min: 8 })
        .withMessage('must be at least 8 chars'),
    check('profilePic')
        .optional(),
    check('sessionCost')
        .notEmpty()
        .withMessage("session price must not be empty")
        .isNumeric()
        .withMessage("cost must be numeric"),
    check('state')
        .isBoolean()
        .withMessage("state must be boolean"),

    validatorMiddleware,
];

exports.getDermatologistValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];

exports.updateDermatologistValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),

    validatorMiddleware,
];

exports.deleteDermatologistValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];