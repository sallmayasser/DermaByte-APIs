const express = require('express');
const {
  getTestServiceValidator,
  createTestServiceValidator,
  updateTestServiceValidator,
  deleteTestServiceValidator,
} = require('../utils/validators/testServiceValidator');

const {
  getTestServices,
  setLabIdToBody,
  createTestService,
  getTestService,
  updateTestService,
  deleteTestService,
} = require('../controllers/testServiceController');
const authController = require('../controllers/authController');
const {
  createFilterObj,
  getLoggedUserData,
} = require('../controllers/handlersFactory');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/').get(
  authController.allowedTo('admin'),
  (req, res, next) => {
    createFilterObj(req, res, next, 'lab');
  },
  getTestServices,
);
router
  .route('/:id')
  //getTestServiceValidator validation layer  rule call validator
  .get(
    authController.allowedTo('admin', 'lab'),
    getTestServiceValidator,
    getTestService,
  )
  .put(
    authController.allowedTo('admin', 'lab'),
    updateTestServiceValidator,
    updateTestService,
  )
  .delete(
    authController.allowedTo('admin', 'lab'),
    deleteTestServiceValidator,
    deleteTestService,
  );

module.exports = router;
