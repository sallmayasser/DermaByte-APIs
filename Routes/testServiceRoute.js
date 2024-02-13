const express = require('express');
const { getTestServiceValidator, createTestServiceValidator, updateTestServiceValidator, deleteTestServiceValidator } = require("../utils/validators/testServiceValidator")

const { getTestServices ,createTestService, getTestService, updateTestService, deleteTestService } = require("../controllers/testServiceController");

const router = express.Router();

router.route('/').get(getTestServices)
    .post( createTestServiceValidator, createTestService);

router.route('/:id')
    //getTestServiceValidator validation layer  rule call validator 
    .get(getTestServiceValidator, getTestService)
    .put(updateTestServiceValidator, updateTestService)
    .delete (deleteTestServiceValidator, deleteTestService);

module.exports = router;