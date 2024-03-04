const mongoose = require('mongoose');
///1)create schema
const labReservationsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
    },

    lab: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lab',
    },
    test: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'TestService',
      },
    ],
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

labReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'test',
    select: 'name cost -lab -_id',
  });
  next();
});

labReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'patient',
    select: 'firstName lastName  -_id',
  });
  next();
});
///2)create model
module.exports = mongoose.model('LabReservation', labReservationsSchema);
