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
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
    },
    dermatologist: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dermatologist',
    },
    tests:
      [{
      testName: { type: String },
      requestedAt: {
          type: Date,
          default:Date.now() }
      },],
    
  },
  { timestamps: true },
);

// reportsSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tests',
//     select: ' testName createdAt updatedAt  -_id',
//   });
//   next();
// });
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
    select: ' firstName lastName age photo  ',
  });
  next();
});


reportsSchema.virtual('ReqTests', {
  ref: 'RequestedTest',
  localField: 'patientId',
  foreignField: 'patient',
  justOne: false,
});


///2)create model
module.exports = mongoose.model('Report', reportsSchema);
