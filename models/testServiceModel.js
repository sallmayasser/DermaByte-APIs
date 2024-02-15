const mongoose = require('mongoose');
///1)create schema
const testServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "test name is requied"]
    },
    cost:
    {
        type: Number,
        required: [true, 'test cost is requied']
    },
    lab: {
        type: mongoose.Schema.ObjectId,
        ref: "Lab",
    },

}, { timestamps: true })


///2)create model
module.exports = mongoose.model("TestService", testServiceSchema);