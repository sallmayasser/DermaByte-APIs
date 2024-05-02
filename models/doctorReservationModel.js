const mongoose = require('mongoose');
///1)create schema
const doctorReservationsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'reservation date is required'],
    },
    dayName: {
      type: String,
    },
    uploadedTest: {
      type: [String],
      default: null,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: String,
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
    scan: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Scans',
      },
    ],

    meetingUrl: {
      type: String,
    },
    symptoms: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    // tests: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'RequestedTest',
    //   },
    // ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
doctorReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'patient',
    select: 'firstName lastName profilePic email',
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
doctorReservationsSchema.virtual('Report', {
  ref: 'Report',
  localField: 'dermatologist',
  foreignField: 'dermatologist',
  options: { select: '_id' },
});
module.exports = mongoose.model('DoctorReservation', doctorReservationsSchema);
