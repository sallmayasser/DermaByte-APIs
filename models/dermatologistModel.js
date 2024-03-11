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
    gender: {
      type: String,
      required: [true, 'gender required'],
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
      type: [String],
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
    passwordChangedAt:Date,
    passwordResetCode: String,
    passwordResetExpires:Date,
    passwordResetVerified:Boolean,
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
    active:{
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    role: {
      type: String,
      default: "dermatologist",
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be below or equal 5.0'],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
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
  dermatologistsSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'dermatologist',
  });
  const setImageURL = (doc) => {
    if (doc.profilePic) {
      const imageUrl = `${process.env.BASE_URL}/dermatologists/${doc.profilePic}`;
      doc.profilePic = imageUrl;
    }
    if (doc.license) {
      const imagesList = [];
      doc.license.forEach((image) => {
        const imageUrl = `${process.env.BASE_URL}/dermatologists/${image}`;
        imagesList.push(imageUrl);
      });
      doc.license = imagesList;
    }
  };
// findOne, findAll and update
dermatologistsSchema.post('init', (doc) => {
  setImageURL(doc);
});
// create
dermatologistsSchema.post('save', (doc) => {
  setImageURL(doc);
});
///2)create model
module.exports = mongoose.model("Dermatologist", dermatologistsSchema);