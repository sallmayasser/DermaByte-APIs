
const mongoose = require('mongoose');
///1)create schema
const doctorReservationsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true,"reservation date is required"]
    },
    uploadedTest: {
        type: String,
        default: null,
    },patient
    : {
        type: mongoose.Schema.ObjectId,
        ref: "Patient",

    },
    dermatologist :{
        type: mongoose.Schema.ObjectId,
        ref: "Dermatologist",

    },
    
}, { timestamps: true })
///2)create model
module.exports = mongoose.model("DoctorReservation", doctorReservationsSchema);