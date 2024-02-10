const mongoose = require('mongoose');
///1)create schema
const reportsSchema = new mongoose.Schema({
    requestedTest:{
        type:String,
        default:null
    },
    medicine:{
        type:String,
        required:[true, "medication is required "]
    },
    result: [{
        type: mongoose.Schema.ObjectId,
        ref: "Result",

    },],
    doctorReservation: {
        type: mongoose.Schema.ObjectId,
        ref: "DoctorReservation",

    },
    scan : {
        type: mongoose.Schema.ObjectId,
        ref: "Scans",

    },

}, { timestamps: true })
///2)create model
module.exports = mongoose.model("Report", reportsSchema);