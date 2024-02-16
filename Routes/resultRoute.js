const express = require('express');
const { getResultValidator, createResultValidator, updateResultValidator, deleteResultValidator } = require("../utils/validators/resultValidator")

const { getResults, createResult, getResult, updateResult, deleteResult } = require("../controllers/resultController");


const router = express.Router();

router.route('/')
    .get(getResults)
    .post(createResultValidator, createResult);

router.route('/:id')
    //getResultValidator validation layer  rule call validator 
    .get(getResultValidator, getResult)
    .put(updateResultValidator, updateResult)
    .delete(deleteResultValidator, deleteResult);

module.exports = router;