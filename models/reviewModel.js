const mongoose = require('mongoose');
const Dermatologist = require('./dermatologistModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: [true, 'Review must belong to Patient'],
    },
    dermatologist: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dermatologist',
      // required: [true, 'Review must belong to dermatologist'],
    },
    // parent reference (one to many)
    lab: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lab',
      // required: [true, 'Review must belong to lab'],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'patient', select: 'firstName lastName' });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  dermatologistId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific dermatologist
    {
      $match: { dermatologist: dermatologistId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: 'dermatologist',
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  console.log(result);

  if (result.length > 0) {
    await Dermatologist.findByIdAndUpdate(dermatologistId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Dermatologist.findByIdAndUpdate(dermatologistId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.dermatologist);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.dermatologist);
});

module.exports = mongoose.model('Review', reviewSchema);