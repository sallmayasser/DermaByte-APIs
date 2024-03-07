const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Lab = require('../models/labModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const{uploadMixOfImages }=require('../middleware/uploadImageMiddleware');

// Upload single image
exports.uploadLabImage = uploadMixOfImages([{
  name: 'profilePic',
  maxCount: 1,
},
{
  name: 'license',
  maxCount: 20,
},
]);

exports.resizeLabImage = asyncHandler(async (req, res, next) => {
  ///1)image processing for profile Name
  if (req.files.profilePic) {
      const filename = `lab-${uuidv4()}-${Date.now()}.jpeg`
      await sharp(req.files.profilePic[0].buffer)
          .resize(320, 320)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/labs/${filename}`);
      // save image into our database
      req.body.profilePic = filename;
  }
  ///2)image processing for images
  if (req.files.license) {
      req.body.license = [];
      await Promise.all(req.files.license.map(async (img, index) => {
          const filename = `lab-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
          await sharp(img.buffer)
              .resize(500, 500)
              .toFormat("jpeg")
              .jpeg({ quality: 95 })
              .toFile(`uploads/labs/${filename}`);
          // save image into our database
          req.body.license.push(filename);
      })
      );
      
  }
  next();
});

exports.getLabs = factory.getAll(Lab, 'Services');
exports.getLab = factory.getOne(Lab, 'Services');
exports.createLab = factory.createOne(Lab);
exports.updateLab = asyncHandler(async (req, res, next) => {
  const document = await Lab.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      mobile: req.body.mobile,
      location: req.body.location,
      city: req.body.city,
      country: req.body.country,
      email: req.body.email,
      license: req.body.license,
      state: req.body.state,
      profilePic: req.body.profilePic,
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
