const mongoose = require('mongoose');
///1)create schema
const requestedTestsSchema = new mongoose.Schema(
  {
    testName: [
      {
        type: String,
      },
    ],
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
    },
    dermatologist: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dermatologist',
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
///2)create model
module.exports = mongoose.model('RequestedTest', requestedTestsSchema);
