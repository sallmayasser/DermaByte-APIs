const express = require('express');
const { getTestServiceValidator, createTestServiceValidator, updateTestServiceValidator, deleteTestServiceValidator } = require("../utils/validators/testServiceValidator")

const { getTestServices ,createFilterObj,setLabIdToBody,createTestService, getTestService, updateTestService, deleteTestService } = require("../controllers/testServiceController");
const authController = require('../controllers/authController');

const router = express.Router({mergeParams:true});

router.route('/').get(authController.protect,authController.allowedTo("admin"),createFilterObj,getTestServices)
    .post(authController.protect,authController.allowedTo("lab"),setLabIdToBody, createTestServiceValidator, createTestService);

router.route('/:id')
    //getTestServiceValidator validation layer  rule call validator 
    .get(authController.protect,getTestServiceValidator, getTestService)
    .put(authController.protect,authController.allowedTo("lab"),updateTestServiceValidator, updateTestService)
    .delete (authController.protect,authController.allowedTo("admin"),deleteTestServiceValidator, deleteTestService);

module.exports = router;