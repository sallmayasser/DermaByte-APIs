const { check } = require('express-validator');
const { Types } = require('mongoose');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const doctorReservationModel = require('../../models/doctorReservationModel');
const ApiError = require('../apiError');
const labModel = require('../../models/labModel');
const testServiceModel = require('../../models/testServiceModel');
const labReservationModel = require('../../models/labReservationModel');

exports.createReservationValidator = [
  check('date').notEmpty().withMessage('reservation date is required'),
  check('dermatologist').notEmpty().withMessage('dermatologist is required'),
  check('scan').custom(async (value, { req }) => {
    const existingReservation = await doctorReservationModel.find({
      scan: value,
      dermatologist: req.body.dermatologist,
    });
    if (existingReservation.length !== 0) {
      throw new Error(
        'You have already reserve with this dermatologist with same Scan',
      );
    }
    return true; // Return true if the validation passes
  }),

  validatorMiddleware,
];
exports.createLabReservationValidator = [
  check('test')
    .notEmpty()
    .withMessage('You must add at least one test')
    .custom(async (value, { req }) => {
      try {
        const existingTests = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const testId of value) {
          const objectId = new Types.ObjectId(testId);
          // eslint-disable-next-line no-await-in-loop
          const existingTest = await testServiceModel.findOne({
            _id: objectId,
            lab: req.body.lab,
          });
          // eslint-disable-next-line no-await-in-loop
          const existingReservedTests = await labReservationModel.findOne({
            test: testId,
            lab: req.body.lab,
          }).select("test");
          if (!existingTest) {
            throw new Error(
              'Invalid Test ID or Test does not belong to the lab',
            );
          } else {
            existingTests.push(existingReservedTests);
          }
        }
        const filteredArray = existingTests.filter((x) => x !== null);
        if (filteredArray.length > 0) {
          const reservationTestNames = filteredArray
            .map((item) => item.test.map((test) => test.name))
            .flat()
            .join(', ');
          throw new Error(
            `You have already reserved the following test(s): ${reservationTestNames}`,
          );
        }

        return true; // Return true if all tests are valid
      } catch (error) {
        throw new Error(error.message);
      }
    }),

  check('lab')
    .notEmpty()
    .withMessage('lab ID is required ')
    .custom(async (value) => {
      const objectId = new Types.ObjectId(value);
      const existingLab = await labModel.findById(objectId);
      if (!existingLab) {
        throw new Error(' Wrong Lab Id !!');
      }
      return true; // Return true if the validation passes
    }),

  validatorMiddleware,
];

exports.getReservationValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateReservationValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),

  validatorMiddleware,
];

exports.deleteReservationValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
