
const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.createTestServiceValidator = [
    check('name')
        .isLength({ min: 2 })
        .withMessage('must be at least 2 chars')
        .isLength({ max: 32 })
        .withMessage('must be at least 2 chars')
        .notEmpty()
        .withMessage(' test name is required'),
    check('cost')
        .notEmpty()
    .withMessage(' cost is required'),
    validatorMiddleware,
];

exports.getTestServiceValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];

exports.updateTestServiceValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),

    validatorMiddleware,
];

exports.deleteTestServiceValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];