const express = require('express');
const formidable = require('formidable');
const {
  getResultValidator,
  updateResultValidator,
  deleteResultValidator,
} = require('../utils/validators/resultValidator');
const { uploadImage, resizeImage } = require('../controllers/imageController');
const { setLabToBody } = require('../controllers/labController');
const {
  getResults,
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
    setLabIdToBody,
    setLabToBody,
    (req, res, next) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form data:', err);
          res.status(500).send('Error parsing form data');
          return;
        }
        req.body.patient = fields.patient[0];
        req.files = { testResult: files };
        next();
      });
    },
    resizeImage,
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
