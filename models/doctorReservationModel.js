const mongoose = require('mongoose');
///1)create schema
const doctorReservationsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'reservation date is required'],
    },
    uploadedTest: {
      type: [String],
      default: null,
    },
    reviewed: {
      type: Boolean,
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
    scan: {
      type: mongoose.Schema.ObjectId,
      ref: 'Scans',
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
    select: 'firstName lastName ',
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
const setImageURL = (doc) => {
  if (doc.uploadedTest) {
    const imagesList = [];
    doc.uploadedTest.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/reservations/${image}`;
      imagesList.push(imageUrl);
    });
    doc.uploadedTest = imagesList;
  }
};
// findOne, findAll and update
doctorReservationsSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
doctorReservationsSchema.post('save', (doc) => {
  setImageURL(doc);
});
module.exports = mongoose.model('DoctorReservation', doctorReservationsSchema);
