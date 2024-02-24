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
///2)create model
module.exports = mongoose.model('DoctorReservation', doctorReservationsSchema);
