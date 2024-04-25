const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const handlers = require('./handlersFactory');
const Reservation = require('../models/doctorReservationModel');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware');
const { createMeeting } = require('./meetingController');
const doctorScheduleModel = require('../models/doctorScheduleModel');

exports.uploadUploadedTestImages = uploadMixOfImages([
  { name: 'uploadedTest', maxCount: 30 },
]);

exports.resizeUploadedTestImages = asyncHandler(async (req, res, next) => {
  //2)image processing for images
  if (req.files.uploadedTest) {
    req.body.uploadedTest = [];
    await Promise.all(
      req.files.uploadedTest.map(async (img, index) => {
        const imageName = `reservation-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/reservations/${imageName}`);
        // save image into our database
        req.body.uploadedTest.push(imageName);
      }),
    );
  }
  next();
});
exports.getAllReservations = handlers.getAll(Reservation);

exports.getReservation = handlers.getOne(Reservation);

exports.updateReservation = handlers.updateOne(Reservation);

exports.deleteReservation = handlers.deleteOne(Reservation);

// exports.createReservation = asyncHandler(async (req, res) => {
//   const { date, dermatologist, scan, uploadedTest, patient, reviewed } =
//     req.body;

//   const durations = await doctorScheduleModel
//     .find({
//       dermatologist: req.body.dermatologist,
//     })
//     .select('sessionTime');
//   const duration = durations.map((time) => time.sessionTime);

//   const meeting = await createMeeting(
//     'My Consultation',
//     duration[0],
//     req.body.date,
//   );

//   const newDoc = await Reservation.create({
//     date: date,
//     dermatologist: dermatologist,
//     patient: patient,
//     scan: scan,
//     uploadedTest: uploadedTest,
//     meetingUrl: meeting.meeting_url,
//     reviewed: reviewed,
//   });
//   // Convert the document to JSON with virtuals
//   const responseData = newDoc.toJSON({ virtuals: true });
//   res.status(201).json({ data: responseData });
// });
// Nested route
// GET /api/v1/patients/:patientId/Dermatologist-reservation
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.id) filterObject = { patient: req.params.id };
  req.filterObj = filterObject;
  next();
};

exports.setPatientIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.patient) req.body.patient = req.params.id;
  next();
};
