const asyncHandler = require('express-async-handler');
const Labs = require('../models/labModel');
const Dermatologist = require('../models/dermatologistModel')
const ApiError = require('../utils/apiError');

exports.Approve = asyncHandler(async (req, res, next) => {
  // Execute both queries concurrently using Promise.all
  Promise.all([
    Labs.findByIdAndUpdate(req.body.id, { state: true }, { new: true }),
    Dermatologist.findByIdAndUpdate(
      req.body.id,
      { state: true },
      { new: true },
    ),
  ])
    .then(([foundLabs, foundDermatologist]) => {
      // Check if user is found in Labss
      if (foundLabs) {
        res.status(200).json({ data: foundLabs });
      }
      // Check if user is found in dermatologists
      else if (foundDermatologist) {
        res.status(200).json({ data: foundDermatologist });
      }
      // If user is not found in either model, return 404
      else {
        return Promise.reject(
          new ApiError(`No user found for this id ${req.body.id}`, 404),
        );
      }
    })
    .catch(next);
});
