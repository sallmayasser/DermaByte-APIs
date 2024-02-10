const mongoose = require('mongoose');
///1)create schema
const labsSchema = new mongoose.Schema({
    Name: {
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
    license: {
        type: String,
        required: [true, "license is required"]
    },
    testServices:
       [{
            name:String,
            cost:Number,
       }] ,

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
    state: {
        type: Boolean,
        default: false
    },

    

}, { timestamps: true })
///2)create model
module.exports = mongoose.model("Lab", labsSchema);