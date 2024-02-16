const mongoose = require('mongoose');
///1)create schema
const reportsSchema = new mongoose.Schema({
    scan:{
        type:String,
        required:[true, "scan is required "]
    },
    medicine:{
        type:String,
        required:[true, "medication is required "]
    },
    requestedTest:[{
        type:String,
        default:null
    }],
    result: [{
        type: mongoose.Schema.ObjectId,
        ref: "Result",

    },],
    // doctorReservation: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "DoctorReservation",
    //     required:[true, "report must belong to reservtion "]
    // },
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: "Patient",

    },
    dermatologist:{
        type: mongoose.Schema.ObjectId,
        ref: "Dermatologist",

    },

}, { timestamps: true })

///2)create model
module.exports = mongoose.model("Report", reportsSchema);