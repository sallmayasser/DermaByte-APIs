const mongoose = require('mongoose');
///1)create schema
const requestedTestsSchema = new mongoose.Schema(
  {
    testName: [{
      type: String,
    },],
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
    },
    dermatologist: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dermatologist',
    },
  },
  { timestamps: true },
);

// requestedTestsSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'dermatologist',
//     select: ' firstName lastName  -_id',
//   });
//   next();
// });

// requestedTestsSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'patient',
//     select: ' firstName lastName  -_id',
//   });
//   next();
// });

///2)create model
module.exports = mongoose.model('RequestedTest', requestedTestsSchema);
