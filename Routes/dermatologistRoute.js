const express = require('express');
const DrReservation = require("./doctorReservationRoutes")
const { getDermatologistValidator,
//  createDermatologistValidator, 
 updateDermatologistValidator, deleteDermatologistValidator } = require("../utils/validators/dermatologistValidator")
const { getDermatologists, createDermatologist, getDermatologist, updateDermatologist, deleteDermatologist } = require("../controllers/dermatologistController");

const router = express.Router({ mergeParams: true });

router.use('/:Did/Dermatologist-reservation', DrReservation);

router.route('/').get(getDermatologists)
    .post(
        // createDermatologistValidator,
         createDermatologist);

router.route('/:id')
    //getDermatologistValidator validation layer  rule call validator 
    .get(
        getDermatologistValidator,
         getDermatologist)
    .put(
        updateDermatologistValidator,
         updateDermatologist)
    .delete (
        deleteDermatologistValidator,
         deleteDermatologist);

module.exports = router;