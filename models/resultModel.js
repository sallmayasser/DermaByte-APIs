const mongoose = require('mongoose');
///1)create schema
const resultsSchema = new mongoose.Schema({
    TestName:{
        type:String,
        
    },
    TestResult:{
        type:String,
        
    },
    TestDate:{
        type:String,
        default:Date.now()+7*24*60*60*1000
    },

    labReservation: {
        type: mongoose.Schema.ObjectId,
        ref: "LabReservation",
    },

}, { timestamps: true })
///2)create model
module.exports = mongoose.model("Result", resultsSchema);