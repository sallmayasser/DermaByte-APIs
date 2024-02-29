const mongoose = require('mongoose');
///1)create schema
const doctorReservationsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'reservation date is required'],
    },
    uploadedTest: {
      type: String,
      default: null,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },

    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
    },
    dermatologist: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dermatologist',
    },
    scan: {
      type: mongoose.Schema.ObjectId,
      ref: 'Scans',
    },
    tests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'RequestedTest',
      },
    ],
  },
  { timestamps: true },
);
doctorReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'patient',
    select: 'firstName lastName ',
  });
  next();
});
doctorReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'dermatologist',
    select: 'firstName lastName ',
  });
  next();
});

doctorReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'scan',
    select: 'diseasePhoto diseaseName ',
  });
  next();
});

doctorReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tests',
    select: 'requestedTest result ',
  });
  next();
});
///2)create model
module.exports = mongoose.model('DoctorReservation', doctorReservationsSchema);
