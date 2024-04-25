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
    meetingUrl: {
      type: String,
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
    select: 'firstName lastName email',
  });
  next();
});
doctorReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'dermatologist',
    select: 'firstName lastName sessionCost',
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

doctorReservationsSchema.pre('save', function (next) {
  // Adjust the timestamps by adding 2 hours in milliseconds
  // if (this.date) {
  //   this.date = new Date(this.date.getTime() + 2 * 60 * 60 * 1000);
  // }
  if (this.createdAt) {
    this.createdAt = new Date(this.createdAt.getTime() + 2 * 60 * 60 * 1000);
  }
  if (this.updatedAt) {
    this.updatedAt = new Date(this.updatedAt.getTime() + 2 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('DoctorReservation', doctorReservationsSchema);
