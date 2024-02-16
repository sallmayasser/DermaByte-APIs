const express = require('express');
const {
  getLabValidator,
  createLabValidator,
  updateLabValidator,
  deleteLabValidator,
} = require('../utils/validators/labValidator');

const {
  getLabs,
  createLab,
  getLab,
  updateLab,
  deleteLab,
} = require('../controllers/labController');
const { createFilterObj } = require('../controllers/handlersFactory');
const {
  getAllReservations,
} = require('../controllers/labReservationController');
const testServiceRoute =require("./testServiceRoute");

const router = express.Router();

router.use("/:labId/tests",testServiceRoute)
router.route('/').get(getLabs).post(createLabValidator, createLab);

router
  .route('/:id')
  //getLabValidator validation layer  rule call validator
  .get(getLabValidator, getLab)
  .put(updateLabValidator, updateLab)
  .delete(deleteLabValidator, deleteLab);

router.route('/:id/laboratory-reservation').get((req, res, next) => {
  createFilterObj(req, res, next, 'lab');
}, getAllReservations);

module.exports = router;
