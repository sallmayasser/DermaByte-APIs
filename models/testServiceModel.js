const mongoose = require('mongoose');
///1)create schema
const testServiceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"test name is requied"]
    },
    cost:{typr:Number,
    required:[true,"test cost is requied"]
    },

}, { timestamps: true })

testServiceSchema.virtual('labs', {
    ref: 'LabTest',
    localField: '_id',
    foreignField: 'test',
  });
///2)create model
module.exports = mongoose.model("TestService", testServiceSchema);