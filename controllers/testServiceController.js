const TestService = require('../models/testServiceModel')
const factory = require('./handlersFactory');

exports.createFilterObj =(req,res,next) => {
    let filterObject ={};
if(req.params.labId) filterObject={lab: req.params.labId};
    req.filterObj = filterObject;
next();
}

exports.getTestServices = factory.getAll(TestService);
exports.getTestService = factory.getOne(TestService);
exports.setLabIdToBody =(req,res,next)=>{
    //nested route {create}
    if(!req.body.lab) req.body.lab = req.params.labId
    next();
   }
exports.createTestService = factory.createOne(TestService);
exports.updateTestService = factory.updateOne(TestService);
exports.deleteTestService = factory.deleteOne(TestService);