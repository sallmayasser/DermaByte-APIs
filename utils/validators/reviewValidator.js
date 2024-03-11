const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Review = require('../../models/reviewModel');

exports.createReviewValidator = [
  check('title').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),
  check('patient').isMongoId().withMessage('Invalid Review id format'),
  check('dermatologist')
    .optional()
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      // Check if logged patient create review before
      Review.findOne({ patient: req.user._id, dermatologist: req.body.dermatologist }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(
              new Error('You already created a review before')
            );
          }
        }
      )
    ),
    check('lab')
    .optional()
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      // Check if logged patient create review before 
      Review.findOne({ patient: req.user._id, lab: req.body.lab }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(
              new Error('You already created a review before')
            );
          }
        }
      )
    ),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        console.log(review.patient._id)
        console .log(req.user)
        console .log(req.user._id)
        if (review.patient._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid Review id format')
    .custom((val, { req }) => {
      // Check review ownership before update
      if (req.user.role === 'patient') {
        return Review.findById (val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          console.log(review.patient._id)
          console .log(req.user)
          console .log(req.user._id)
          if (review.patient._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];