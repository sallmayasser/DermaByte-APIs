const TestService = require('../models/testServiceModel')
const factory = require('./handlersFactory');

exports.getTestServices = factory.getAll(TestService);
exports.getTestService = factory.getOne(TestService);
exports.createTestService = factory.createOne(TestService);
exports.updateTestService = factory.updateOne(TestService);
exports.deleteTestService = factory.deleteOne(TestService);