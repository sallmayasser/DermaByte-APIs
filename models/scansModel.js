const mongoose = require('mongoose');
///1)create schema
const scansSchema = new mongoose.Schema({
    scanDate:{Date,
    default:Date.now(),
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
    report: {
      type: mongoose.Schema.ObjectId,
      ref: 'Report',
    },
  },
  { timestamps: true },
);
///2)create model
module.exports = mongoose.model('Scan', scansSchema);
