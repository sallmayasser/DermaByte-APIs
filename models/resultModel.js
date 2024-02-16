const mongoose = require('mongoose');
///1)create schema
const resultsSchema = new mongoose.Schema(
  {
    TestName: {
      type: String,
    },
    TestResult: {
      type: String,
    },
    TestDate: {
      type: String,
      default: Date.now(),
    },
    labReservation: {
      type: mongoose.Schema.ObjectId,
      ref: 'LabReservation',
    },
  },
  { timestamps: true },
);
///2)create model
module.exports = mongoose.model('Result', resultsSchema);
