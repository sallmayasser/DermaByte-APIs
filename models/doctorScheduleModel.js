const mongoose = require('mongoose');
///1)create schema
const doctorScheduleSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: [true, "start time is required"]
    },
    endTime: {
        type: String,
        required: [true, "end time is required"],
    },
        sessionTime: {
        type: String,
        required: [true, "session time is required"],
    },
    reserved:{
        type:Boolean,
        default:false
    }
    



}, { timestamps: true })
///2)create model
module.exports = mongoose.model("DoctorSchedule", doctorScheduleSchema);