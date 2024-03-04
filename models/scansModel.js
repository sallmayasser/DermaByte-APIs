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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
const setImageURL = (doc) => {
  if (doc.diseasePhoto){
    const imageUrl = `${process.env.BASE_URL}/scans/${doc.diseasePhoto}`;
    doc.diseasePhoto = imageUrl;
  }
};
// findOne, findAll and update
scansSchema.post('init', (doc) => {
  setImageURL(doc);
});
// create
scansSchema.post('save', (doc) => {
  setImageURL(doc);
});
///2)create model
module.exports = mongoose.model('Scans', scansSchema);
