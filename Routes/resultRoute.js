const express = require('express');
const { getResultValidator, createResultValidator, updateResultValidator, deleteResultValidator } = require("../utils/validators/resultValidator")

const {
    uploadTestResultImages,resizeTestResultImages,
    getResults, createResult, getResult, updateResult, deleteResult } = require("../controllers/resultController");
    const authController = require('../controllers/authController');


const router = express.Router();

router.route('/')
    .get(getResults)
    .post(authController.protect,authController.allowedTo("lab"),
        uploadTestResultImages,resizeTestResultImages,
        createResultValidator, createResult);

router.route('/:id')
    //getResultValidator validation layer  rule call validator 
    .get(getResultValidator, getResult)
    .put(authController.protect,authController.allowedTo("lab"),uploadTestResultImages,resizeTestResultImages,updateResultValidator, updateResult)
    .delete(authController.protect,authController.allowedTo("lab"),deleteResultValidator, deleteResult);

module.exports = router;