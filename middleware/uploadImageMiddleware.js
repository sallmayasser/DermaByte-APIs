const multer = require('multer');
const ApiError = require('../utils/apiError');

const multerOptions = () => {

  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('Only Images allowed', 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {
      fieldNameSize: 255,
      fieldSize: 50 * 1024 * 1024, // Increase the limit for XFile objects
      fields: 20, // Adjust the limits as needed
      fileSize: 50 * 1024 * 1024, // Increase the limit for XFile objects
      files: 1, // Adjust the limits as needed
      parts: 20, // Adjust the limits as needed
      headerPairs: 2000, // Adjust the limits as needed
    },
  });

  return upload;
};

exports.uploadSingleImage = (fieldName) => 
multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

  exports.uploadArrayOfImages = (field) =>
  multerOptions().array(field);
