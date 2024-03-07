const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const handlers = require('./handlersFactory');
const Patient = require('../models/patientModel');
const ApiError = require('../utils/apiError');
const {
  uploadSingleImage,
  uploadMixOfImages,
} = require('../middleware/uploadImageMiddleware');

// Upload single image
exports.uploadPatientImage = uploadSingleImage('profilePic');
// exports.uploadPatientImage = uploadMixOfImages([
//   {
//     name: 'profilePic',
//     maxCount: 1,
//   },
// ]);

// Image processing
exports.resizePatientImage = asyncHandler(async (req, res, next) => {
  const filename = `patient-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/patients/${filename}`);

    // Save image into our db

    //  req.body.license = filename;
    req.body.profilePic = filename;
  }

  next();
});
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
