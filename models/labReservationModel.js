const mongoose = require('mongoose');
///1)create schema
const labReservationsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true,"reservation date is required"]
    },
    patient: [{
        type: mongoose.Schema.ObjectId,
        ref: "Patient",

    },],
    lab: {
        type: mongoose.Schema.ObjectId,
        ref: "Lab",

    },


}, { timestamps: true })
///2)create model
module.exports = mongoose.model("LabReservation", labReservationsSchema);