const mongoose = require('mongoose');
///1)create schema
const testServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'test name is requied'],
    },
    lab: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lab',
    },
    cost: {
      type: Number,
      required: [true, 'test cost is requied'],
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

testServiceSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'lab',
    select: ' photo name ',
  });
  next();
});
//2)create model
module.exports = mongoose.model('TestService', testServiceSchema);
