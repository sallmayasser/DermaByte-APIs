const express = require('express');
const { getLabValidator, createLabValidator ,updateLabValidator, deleteLabValidator } = require("../utils/validators/labValidator")

const { getLabs ,createLab, getLab, updateLab, deleteLab } = require("../controllers/labController");

const router = express.Router();

router.route('/').get(getLabs)
    .post(createLabValidator,createLab);

router.route('/:id')
    //getLabValidator validation layer  rule call validator 
    .get(getLabValidator, getLab)
    .put(updateLabValidator, updateLab)
    .delete (deleteLabValidator, deleteLab);

module.exports = router;