const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const Scans = require('../models/scansModel');
const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');

// Upload single image
exports.uploadScanImage = uploadSingleImage('diseasePhoto');

// Image processing
exports.resizeScanImage = asyncHandler(async (req, res, next) => {
  const filename = `scanphoto-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/scans/${filename}`);

    // Save image into our db

    //  req.body.license = filename;
    req.body.diseasePhoto = filename;
  }
  next();
});
exports.getScans = factory.getAll(Scans);
exports.getScan = factory.getOne(Scans);
exports.createScan = factory.createOne(Scans);
exports.deleteScan = factory.deleteOne(Scans);

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.id;
  next();
};
