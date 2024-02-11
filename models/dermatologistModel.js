const mongoose = require('mongoose');
///1)create schema
const dermatologistsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Name required'],
        minlenth: [2, 'too short  name'],
        maxlength: [32, 'too long  name']
    },
    lastName: {
        type: String,
        required: [true, 'Name required'],
        minlenth: [2, 'too short  name'],
        maxlength: [32, 'too long  name']
    },
    mobile: {
        type: Number,
        min: [11, 'incorrect mobile number'],
        max: [11, "incorrect mobile number "],
    },
    location: {
        type: String

    },
    city: {
        type: String,
        required: [true, "city is required"]
    },
    country: {
        type: String,
        required: [true, "country is required"]
    },
    specialization: {
        type: String,
        default: "dermatologist"
    },
    license: {
        type: String,
        required: [true, "license is required"]
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
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    profilePic: {
        type: String,
    },
    sessionCost:{
        type:Number,
        required: [true, "Session cost is required"]
    },

    state: {
        type: Boolean,
        default: false
    },
    
    

}, { timestamps: true })
dermatologistsSchema.virtual('patients', {
    ref: 'DoctorReservation',
    localField: '_id',
    foreignField: 'doctor',
  });
///2)create model
module.exports = mongoose.model("Dermatologist", dermatologistsSchema);