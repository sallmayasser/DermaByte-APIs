const express = require('express');
const functions = require('../controllers/scheduleController');
const validators = require('../utils/validators/scheduleValidator');

const {
  createFilterObj,
  getLoggedUserData,
} = require('../controllers/handlersFactory');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protect,
    authController.allowedTo('dermatologist'),
    getLoggedUserData,
    functions.setDermatologistIdToBody,
    validators.createScheduleValidator,
    functions.createSchedule,
  )
  .get(
    authController.protect,
    authController.allowedTo('admin'),
    functions.getSchedules,
  );
router.get(
  '/Freetimes',
    authController.protect,
  functions.getFreeTimes

);

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.allowedTo('dermatologist', 'admin'),
    validators.deleteScheduleValidator,
    functions.deleteSchedule,
  )
  .put(
    authController.protect,
    authController.allowedTo('dermatologist'),
    validators.updateScheduleValidator,
    functions.updateSchedule,
  );

module.exports = router;
