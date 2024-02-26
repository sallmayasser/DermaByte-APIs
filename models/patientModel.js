const mongoose = require('mongoose');

///1)create schema
const PatientsSchema = new mongoose.Schema(
    {
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
            required: [true, 'Product price is required'],
            trim: true,
            min: [1, 'age  must be above or equal 1'],
            max: [99, 'age must be below or equal 99'],
        },
        mobile: {
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
            //     // This only works on CREATE and SAVE!!!
            //     validator: function (el) {
            //         return el === this.password;
            //     },
            //     message: 'Passwords are not the same!',
            // },
        },
       
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
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
///2)create model
module.exports = mongoose.model("Patient", PatientsSchema);