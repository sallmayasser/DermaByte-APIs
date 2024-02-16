const express = require('express');
const { getLabValidator, createLabValidator ,updateLabValidator, deleteLabValidator } = require("../utils/validators/labValidator")
const { getLabs ,createLab, getLab, updateLab, deleteLab } = require("../controllers/labController");
const testServiceRoute =require("./testServiceRoute");
const { createFilterObj } = require('../controllers/handlersFactory');
const result = require('../controllers/resultController');
const {getAllReservations} = require('../controllers/labReservationController');

const router = express.Router();

router.use("/:labId/tests", testServiceRoute)

router.route('/').get(getLabs)
    .post(createLabValidator,createLab);

router.route('/:id')
    //getLabValidator validation layer  rule call validator 
    .get(getLabValidator, getLab)
    .put(updateLabValidator, updateLab)
    .delete (deleteLabValidator, deleteLab);

    router.route('/:id/laboratory-reservation').get((req, res, next) => {
      createFilterObj(req, res, next, 'lab');
    }, getAllReservations);
    router.route('/:id/results').get((req, res, next) => {
        createFilterObj(req, res, next, 'lab');
      }, result.getResults);
      
module.exports = router;