const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware');


exports.uploadImage = uploadMixOfImages([
  {
    name: 'profilePic',
    maxCount: 1,
  },
  {
    name: 'license',
    maxCount: 20,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  ///1)image processing for profile Name
  if (req.files.profilePic) {
    const filename = `${req.body.role}-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.profilePic[0].buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/${req.body.role}s/${filename}`);
    // save image into our database
    req.body.profilePic = filename;
  }
  ///2)image processing for images
  if (req.files.license) {
    req.body.license = [];
    await Promise.all(
      req.files.license.map(async (img, index) => {
        const filename = `${req.body.role}-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/${req.body.role}s/${filename}`);
        // save image into our database
        req.body.license.push(filename);
      }),
    );
  }
  next();
});
