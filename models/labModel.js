const mongoose = require('mongoose');
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
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      // validate: {
      //   // This only works on CREATE and SAVE!!!
      //   validator: function (el) {
      //     return el === this.password;
      //   },
      //   message: 'Passwords are not the same!',
      // },
    },
    state: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true} },
);

labsSchema.virtual('patients', {
  ref: 'LabReservation',
  localField: '_id',
  foreignField: 'lab',
});
labsSchema.virtual('tests', {
  ref: 'TestService',
  localField: '_id',
  foreignField: 'lab',
});

///2)create model
module.exports = mongoose.model('Lab', labsSchema);
