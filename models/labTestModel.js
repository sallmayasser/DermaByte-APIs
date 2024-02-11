const mongoose = require('mongoose');
///1)create schema
const labTestSchema = new mongoose.Schema({
    test: {
        type: mongoose.Schema.ObjectId,
        ref: 'TestService',
      },
      lab: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lab',
      },
      

}, { timestamps: true })
///2)create model
module.exports = mongoose.model("LabTestSchema", labTestSchema);