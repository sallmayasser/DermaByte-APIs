const express = require('express');
const { getLabValidator,  updateLabValidator, deleteLabValidator } = require("../utils/validators/labValidator")
// createLabValidator
const { getLabs, createLab, getLab, updateLab, deleteLab } = require("../controllers/labController");

const router = express.Router();

router.route('/').get(getLabs)
    .post(
        // createLabValidator, 
        createLab);

router.route('/:id')
    //getLabValidator validation layer  rule call validator 
    .get(getLabValidator, getLab)
    .put(updateLabValidator, updateLab)
    .delete (deleteLabValidator, deleteLab);

module.exports = router;