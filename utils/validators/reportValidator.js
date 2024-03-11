
const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Report = require('../../models/reportModel')

exports.createReportValidator = [
    check('scan')
        .notEmpty()
        .withMessage('scan is required')
        .custom((val) =>
      Report.findOne({ _id: val }).then((report) => {
        if (report) {
          return Promise.reject(new Error('You are already reserve with this Scan'));
        }
      }),
    ),
    check('requestedTest')
        .optional()
        .isArray()
        .withMessage('requestedTest should be array of string'),
    check('result')
        .optional()
        .isArray()
        .withMessage('results should be array of string'),
    check('patient')
        .notEmpty()
        .withMessage('patient is required'),
    check('dermatologist')
        .notEmpty()
        .withMessage('dermatologist is required'),

    validatorMiddleware,
];

exports.getReportValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];

exports.updateReportValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),

    validatorMiddleware,
];

exports.deleteReportValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleware,
];