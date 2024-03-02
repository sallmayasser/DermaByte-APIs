const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
///1)create schema
const labsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name required'],
      minlenth: [2, 'too short  name'],
      maxlength: [32, 'too long  name'],
    },
    photo: {
      type: String,
    },

    mobile: {
      type: String,
      min: [11, 'incorrect mobile number'],
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

labsSchema.virtual('patients', {
  ref: 'LabReservation',
  localField: '_id',
  foreignField: 'lab',
});
labsSchema.virtual('Services', {
  ref: 'TestService',
  localField: '_id',
  foreignField: 'lab',
});

labsSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

///2)create model
module.exports = mongoose.model('Lab', labsSchema);
