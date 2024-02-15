const express = require('express');
const { getTestServiceValidator, createTestServiceValidator, updateTestServiceValidator, deleteTestServiceValidator } = require("../utils/validators/testServiceValidator")

const { getTestServices ,createFilterObj,setLabIdToBody,createTestService, getTestService, updateTestService, deleteTestService } = require("../controllers/testServiceController");

const router = express.Router({mergeParams:true});

router.route('/').get(createFilterObj,getTestServices)
    .post(setLabIdToBody, createTestServiceValidator, createTestService);

router.route('/:id')
    //getTestServiceValidator validation layer  rule call validator 
    .get(getTestServiceValidator, getTestService)
    .put(updateTestServiceValidator, updateTestService)
    .delete (deleteTestServiceValidator, deleteTestService);

module.exports = router;