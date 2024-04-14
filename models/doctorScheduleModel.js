const mongoose = require('mongoose');
// const { divideTimeRange } = require('../controllers/divideTime');

///1)create schema
const doctorScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: Date,
      required: [true, 'Day is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'end time is required'],
    },
    sessionTime: {
      type: String,
      required: [true, 'session time is required'],
    },
    // freetime: {
    //   type: [],
    // },
    dermatologist: {
      type: mongoose.Schema.ObjectId,
      ref: 'Dermatologist',
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
// doctorScheduleSchema.pre('save', async function (next) {
//   // Calculate free time intervals using divideTimeRange function
//   const timeIntervals = divideTimeRange(
//     this.startTime,
//     this.endTime,
//     this.sessionTime,
//   );
//   this.freetime = timeIntervals;
//   next();
// });

doctorScheduleSchema.pre('save', function (next) {
  // Adjust the timestamps by adding 2 hours in milliseconds
  // if (this.startTime) {
  //   this.startTime = new Date(this.startTime.getTime() + 2 * 60 * 60 * 1000);
  // }
  // if (this.endTime) {
  //   this.endTime = new Date(this.endTime.getTime() + 2 * 60 * 60 * 1000);
  // }
  if (this.createdAt) {
    this.createdAt = new Date(this.createdAt.getTime() + 2 * 60 * 60 * 1000);
  }
  if (this.updatedAt) {
    this.updatedAt = new Date(this.updatedAt.getTime() + 2 * 60 * 60 * 1000);
  }
  next();
});

//2)create model
module.exports = mongoose.model('DoctorSchedule', doctorScheduleSchema);
