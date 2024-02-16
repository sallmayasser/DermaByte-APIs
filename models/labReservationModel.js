const mongoose = require('mongoose');
///1)create schema
const labReservationsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    patient: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
      },
    ],
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
  },

  { timestamps: true },
);

labReservationsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'test',
    select: 'name cost',
  });
  next();
});

///2)create model
module.exports = mongoose.model('LabReservation', labReservationsSchema);
