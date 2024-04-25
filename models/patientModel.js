const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
///1)create schema
const PatientsSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
    },
    firstName: {
      type: String,
      required: [true, 'Name is required'],
      minlenth: [2, 'too short  name'],
      maxlength: [32, 'too long  name'],
    },
    lastName: {
      type: String,
      required: [true, 'Name is  required'],
      minlength: [2, 'too short  name'],
      maxlength: [32, 'too long  name'],
    },
    age: {
      type: Number,
      required: [true, 'age is required'],
      trim: true,
      min: [1, 'age  must be above or equal 1'],
      max: [99, 'age must be below or equal 99'],
    },
    phone: {
      type: String,
      minlength: [11, 'incorrect mobile number'],
      maxlength: [12, 'incorrect mobile number '],
    },
    city: {
      type: String,
      required: [true, 'city is required'],
    },
    country: {
      type: String,
      required: [true, 'country is required'],
    },
    gender: {
      type: String,
      required: [true, 'gender required'],
      enum: ['male', 'female'],
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
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      default: 'patient',
    },
    active: {
      type: Boolean,
      default: true,
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
PatientsSchema.virtual('reservations', {
    ref: 'DoctorReservation',
    localField: '_id',
    foreignField: 'patient',
});
PatientsSchema.virtual('labs', {
    ref: 'LabReservation',
    localField: '_id',
    foreignField: 'patient',
});

PatientsSchema.virtual('Tests', {
  ref: 'RequestedTest',
  localField: '_id',
  foreignField: 'patient',
});

PatientsSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const setImageURL = (doc) => {
  if (doc.profilePic){
    const imageUrl = `${process.env.BASE_URL}/patients/${doc.profilePic}`;
    doc.profilePic = imageUrl;
  }
};
// findOne, findAll and update
PatientsSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
PatientsSchema.post('save', (doc) => {
  setImageURL(doc);
});
///2)create model
module.exports = mongoose.model("Patient", PatientsSchema);