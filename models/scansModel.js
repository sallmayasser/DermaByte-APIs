const mongoose = require('mongoose');
///1)create schema
const scansSchema = new mongoose.Schema(
  {
    scanDate: {
      type: Date,
      default: Date.now(),
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
  { timestamps: true },
);

///2)create model
module.exports = mongoose.model('Scans', scansSchema);
