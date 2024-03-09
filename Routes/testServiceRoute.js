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

router.use(authController.protect, authController.allowedTo('admin'));

router.route('/').get((req, res, next) => {
  createFilterObj(req, res, next, 'lab');
}, getTestServices);
router
  .route('/:id')
  //getTestServiceValidator validation layer  rule call validator
  .get(getTestServiceValidator, getTestService)
  .put(updateTestServiceValidator, updateTestService)
  .delete(
    authController.allowedTo('admin', 'lab'),
    deleteTestServiceValidator,
    deleteTestService,
  );

module.exports = router;
