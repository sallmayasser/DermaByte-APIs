const asyncHandler = require('express-async-handler');
const Lab = require('../models/labModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');

exports.getLabs = factory.getAll(Lab, 'Services');
exports.getLab = factory.getOne(Lab, 'Services');
exports.createLab = factory.createOne(Lab);
exports.updateLab = asyncHandler(async (req, res, next) => {
  const document = await Lab.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      lastName: req.body.lastName,
      slug: req.body.slug,
      mobile: req.body.mobile,
      email: req.body.email,
      license: req.body.license,
      city: req.body.city,
      country: req.body.country,
      state: req.body.state,
      photo: req.body.photo,
      location: req.body.location,
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
exports.deleteLab = factory.deleteOne(Lab);
