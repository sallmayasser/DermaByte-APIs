const express = require('express');
const {
  getResultValidator,
  createResultValidator,
  updateResultValidator,
  deleteResultValidator,
} = require('../utils/validators/resultValidator');
const { uploadImage, resizeImage } = require('../controllers/imageController');
const { setLabToBody } = require('../controllers/labController');
const {
  getResults,
  createResult,
  getResult,
  updateResult,
  deleteResult,
  setLabIdToBody,
} = require('../controllers/resultController');
const authController = require('../controllers/authController');
const { getLoggedUserData } = require('../controllers/handlersFactory');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.allowedTo('admin'), getResults)
  .post(
    authController.protect,
    authController.allowedTo('lab'),
    getLoggedUserData,
    uploadImage,
    setLabToBody,
    resizeImage,
    setLabIdToBody,
    createResultValidator,
    createResult,
  );

router
  .route('/:id')
  //getResultValidator validation layer  rule call validator
  .get(authController.protect, getResultValidator, getResult)
  .put(
    authController.protect,
    authController.allowedTo('lab'),
    uploadImage,
    setLabToBody,
    resizeImage,
    updateResultValidator,
    updateResult,
  )
  .delete(
    authController.protect,
    authController.allowedTo('lab'),
    deleteResultValidator,
    deleteResult,
  );

module.exports = router;
