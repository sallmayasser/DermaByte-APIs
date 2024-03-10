const mongoose = require('mongoose');
///1)create schema
const resultsSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: [true, 'test name is required'],
    },
    testResult: {
      type: [String],
      required: [true, 'test result is required'],
    },
    testDate: {
      type: String,
      default: () =>
        new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
    },
    // labReservation: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'LabReservation',
    //   required: [true,"test result must belong to lab result"]
    // },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
    },
    lab: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lab',
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

resultsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'lab',
    select: 'photo name  location -_id',
  });
  next();
});
const setImageURL = (doc) => {
  if (doc.testResult) {
    const imagesList = [];
    doc.testResult.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/results/${image}`;
      imagesList.push(imageUrl);
    });
    doc.testResult = imagesList;
  }
};
// findOne, findAll and update
resultsSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
resultsSchema.post('save', (doc) => {
  setImageURL(doc);
});
///2)create model
module.exports = mongoose.model('Result', resultsSchema);
