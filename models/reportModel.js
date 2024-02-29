const mongoose = require('mongoose');
///1)create schema
const reportsSchema = new mongoose.Schema(
  {
    scan: {
      type: String,
      required: [true, 'scan is required '],
    },
    medicine: {
      type: String,
      default: null,
    },
    treatmentPlan: {
      type: String,
      default: null,
    },
    diagnoses: {
      type: String,
      default: null,
    },
    // doctorReservation: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "DoctorReservation",
    //     required:[true, "report must belong to reservtion "]
    // },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
    },
    dermatologist: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dermatologist',
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

reportsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tests',
    select: ' testName createdAt updatedAt  -_id',
  });
  next();
});
reportsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'dermatologist',
    select: ' firstName lastName  -_id',
  });
  next();
});

reportsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'patient',
    select: ' firstName lastName  -_id',
  });
  next();
});

///2)create model
module.exports = mongoose.model('Report', reportsSchema);
