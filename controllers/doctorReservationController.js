const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler'); 
const handlers = require('./handlersFactory');
const Reservation = require('../models/doctorReservationModel');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware');


// exports.uploadUploadedTestImages = uploadMixOfImages([{ name: 'uploadedTest', maxCount: 30 }]);

// exports.resizeUploadedTestImages = asyncHandler(async (req, res, next) => {
//   console.log('Request Body:', req.body);
//   console.log('Request Files:', req.files);

//   //2)image processing for images
//   if (req.files.uploadedTest) {
//     req.body.uploadedTest = [];
//     await Promise.all(req.files.uploadedTest.map(async (img, index) => {
//       const imageName = `reservations-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
//       await sharp(img.buffer)
//         .resize(600, 600)
//         .toFormat("jpeg")
//         .jpeg({ quality: 95 })
//         .toFile(`uploads/reservations/${imageName}`);
//       // save image into our database
//       req.body.uploadedTest.push(imageName);
//     })
//     );
//     next();
//   }
// });

exports.uploadUploadedTestImages = uploadMixOfImages([{ name: 'uploadedTest', maxCount: 30 }]);

exports.resizeUploadedTestImages = asyncHandler(async (req, res, next) => {
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    //2)image processing for images
    if (req.files.uploadedTest) {
        req.body.uploadedTest = [];
        await Promise.all(req.files.uploadedTest.map(async (img, index) => {
            const imageName = `reservation-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
            await sharp(img.buffer)
                .resize(500, 500)
                .toFormat("jpeg")
                .jpeg({ quality: 95 })
                .toFile(`uploads/reservations/${imageName}`);
            // save image into our database
            req.body.uploadedTest.push(imageName);
        })
        );
    }
    next();
});
exports.getAllReservations = handlers.getAll(Reservation);

exports.getReservation = handlers.getOne(Reservation);

exports.updateReservation = handlers.updateOne(Reservation);

exports.deleteReservation = handlers.deleteOne(Reservation);

exports.createReservation = handlers.createOne(Reservation);

// Nested route
// GET /api/v1/patients/:patientId/Dermatologist-reservation
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.id) filterObject = { patient: req.params.id };
  req.filterObj = filterObject;
  console.log(filterObject);
  next();
};


exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.patientId;
  next();
};
