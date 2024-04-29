const mongoose = require('mongoose');
///1)create schema
const scansSchema = new mongoose.Schema(
  {
    scanDate: {
      type: Date,
      default: Date.now()+ 2 * 60 * 60 * 1000,
    },
    diseasePhoto: {
      type: String,
    },
    diseaseName: {
      type: String,
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
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
module.exports = mongoose.model('Scans', scansSchema);
