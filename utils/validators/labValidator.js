
const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.createLabValidator = [
    check('name')
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
    check('state')
        .isBoolean()
        .withMessage("state must be boolean"),

    validatorMiddleware,
];

exports.getLabValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];

exports.updateLabValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),

    validatorMiddleware,
];

exports.deleteLabValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];