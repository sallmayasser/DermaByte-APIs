const express = require('express');
const { getDermatologistValidator, createDermatologistValidator, updateDermatologistValidator, deleteDermatologistValidator } = require("../utils/validators/dermatologistValidator")
const { getDermatologists, createDermatologist, getDermatologist, updateDermatologist, deleteDermatologist } = require("../controllers/dermatologistController");
// const patientRoute= require ("./patientRoutes")

const router = express.Router();

// router.use("/:dermatologistId/patients", patientRoute);


router.route('/').get(getDermatologists)
    .post( createDermatologistValidator,createDermatologist);

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