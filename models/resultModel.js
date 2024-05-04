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
      type: Date,
      default: Date.now() ,

    },
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
    select: 'profilePic firstName id',
  });
  next();
});
///2)create model
module.exports = mongoose.model('Result', resultsSchema);
