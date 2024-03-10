
const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.createResultValidator = [
    check('testName')
        .notEmpty()
        .withMessage('test name is required'),
    check('testResult')
        .optional(),
    check('testDate')
        .optional(),
        check('patient')
        .notEmpty()
        .withMessage('patient is required'),
    check('lab')
        .notEmpty()
        .withMessage('lab is required'),
    validatorMiddleware,
];

exports.getResultValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];

exports.updateResultValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),

    validatorMiddleware,
];

exports.deleteResultValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];