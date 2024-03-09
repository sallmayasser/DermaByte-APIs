const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Dermatologist = require('../models/dermatologistModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const{uploadMixOfImages }=require('../middleware/uploadImageMiddleware');


// Upload single image
exports.uploadDermatologistImage = uploadMixOfImages([{
  name: 'profilePic',
  maxCount: 1,
},
{
  name: 'license',
  maxCount: 20,
},
]);

exports.resizeDermatologistImage = asyncHandler(async (req, res, next) => {
  ///1)image processing for profile Name
  if (req.files.profilePic) {
      const filename = `dermatologist-${uuidv4()}-${Date.now()}.jpeg`
      await sharp(req.files.profilePic[0].buffer)
          .resize(320, 320)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/dermatologists/${filename}`);
      // save image into our database
      req.body.profilePic = filename;
  }
  ///2)image processing for images
  if (req.files.license) {
      req.body.license = [];
      await Promise.all(req.files.license.map(async (img, index) => {
          const filename = `dermatologist-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
          await sharp(img.buffer)
              .resize(500, 500)
              .toFormat("jpeg")
              .jpeg({ quality: 95 })
              .toFile(`uploads/dermatologists/${filename}`);
          // save image into our database
          req.body.license.push(filename);
      })
      );
     
  }
  next();
});

exports.getDermatologists = factory.getAll(Dermatologist);
exports.getDermatologist = factory.getOne(Dermatologist);
exports.createDermatologist = factory.createOne(Dermatologist);
exports.updateDermatologist = asyncHandler(async (req, res, next) => {
  const document = await Dermatologist.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      slug: req.body.slug,
      mobile: req.body.mobile,
      email: req.body.email,
      license: req.body.license,
      city: req.body.city,
      country: req.body.country,
      state: req.body.state,
      profilePic: req.body.profilePic,
      gender: req.body.gender,
      location: req.body.location,
      sessionCost: req.body.sessionCost,
      specialization: req.body.specialization,
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
exports.deleteDermatologist = factory.deleteOne(Dermatologist);

exports.updateLoggedDermatologistData = asyncHandler(async (req, res, next) => {
  const updatedUser = await Dermatologist.findByIdAndUpdate(
    req.user._id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      slug: req.body.slug,
      mobile: req.body.mobile,
      email: req.body.email,
      license: req.body.license,
      city: req.body.city,
      country: req.body.country,
      state: req.body.state,
      profilePic: req.body.profilePic,
      gender: req.body.gender,
      location: req.body.location,
      sessionCost: req.body.sessionCost,
      specialization: req.body.specialization,
    },
    { new: true },
  );
  console.log(updatedUser);

  res.status(200).json({ data: updatedUser });
});
