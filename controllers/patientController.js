const asyncHandler = require('express-async-handler');

const handlers = require('./handlersFactory');
const Patient = require('../models/patientModel');
const ApiError = require('../utils/apiError');
const {
  uploadMixOfImages,
} = require('../middleware/uploadImageMiddleware');

// Upload single image
exports.uploadPatientImage = uploadMixOfImages([
  {
    name: 'profilePic',
    maxCount: 1,
  },
]);

exports.getAllPatients = handlers.getAll(Patient);

exports.getPatient = handlers.getOne(Patient);

exports.updatePatient = asyncHandler(async (req, res, next) => {
  const document = await Patient.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      slug: req.body.slug,
      mobile: req.body.mobile,
      email: req.body.email,
      age: req.body.age,
      city: req.body.city,
      country: req.body.country,
      gender: req.body.gender,
      profilePic: req.body.profilePic,
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

exports.deletePatient = handlers.deleteOne(Patient);

exports.createPatient = handlers.createOne(Patient);

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedPatientData = asyncHandler(async (req, res, next) => {
  const updatedUser = await Patient.findByIdAndUpdate(
    req.user._id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      slug: req.body.slug,
      mobile: req.body.mobile,
      email: req.body.email,
      age: req.body.age,
      city: req.body.city,
      country: req.body.country,
      gender: req.body.gender,
      profilePic: req.body.profilePic,
    },
    { new: true },
  );
 

  res.status(200).json({ data: updatedUser });
});
exports.setPatientToBody = (req, res, next) => {
  //nested route {create}
  if (!req.body.role) req.body.role = 'patient';
  next();
};