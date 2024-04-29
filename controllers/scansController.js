const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Scans = require('../models/scansModel');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const scansModel = require('../models/scansModel');

// async function getDiseasePrediction(diseasePhoto) {
//   const client = new Client('DermaByte/DermaByteApp');
//   const result = await client.predict({
//     image_url: diseasePhoto,
//     api_name: '/predict',
//   });
//   return result.data;
// }

exports.getScans = factory.getAll(Scans);

exports.getScan = factory.getOne(Scans);

exports.createScan = asyncHandler(async (req, res, next) => {
  const { diseasePhoto } = req.body;
  console.log(diseasePhoto);
  try {
    const response = await axios.post(
      'https://dermabytemodel.onrender.com/predict',
      {
        image_url: diseasePhoto,
      },
    );
    req.body.diseaseName = response.data.predicted_class;
    const newDoc = await scansModel.create(req.body);
    res.status(200).json({data:newDoc});
  } catch (error) {
    // Handle error
    console.error(error);
    return next(new ApiError(`Please try again later `, 500));
  }
});

exports.deleteScan = factory.deleteOne(Scans);

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.id;
  next();
};
