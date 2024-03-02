const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

///1)create schema
const dermatologistsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Name required'],
      minlenth: [2, 'too short  name'],
      maxlength: [32, 'too long  name'],
    },
    lastName: {
      type: String,
      required: [true, 'Name required'],
      minlength: [2, 'too short  name'],
      maxlength: [32, 'too long  name'],
    },
    mobile: {
      type: String,
      min: [11, 'incorrect mobile number'],
      max: [11, 'incorrect mobile number '],
    },
    location: {
      type: String,
    },
    city: {
      type: String,
      required: [true, 'city is required'],
    },
    country: {
      type: String,
      required: [true, 'country is required'],
    },
    specialization: {
      type: String,
      default: 'dermatology',
    },
    license: {
      type: String,
      required: [true, 'license is required'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
    profilePic: {
      type: String,
    },
    sessionCost: {
      type: Number,
      required: [true, 'Session cost is required'],
    },

    state: {
      type: Boolean,
      default: false,
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
dermatologistsSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

dermatologistsSchema.virtual('reservations', {
    ref: 'DoctorReservation',
    localField: '_id',
    foreignField: 'dermatologist',
  });
  
///2)create model
module.exports = mongoose.model("Dermatologist", dermatologistsSchema);