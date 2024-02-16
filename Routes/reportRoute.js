const express = require('express');
const { getReportValidator, createReportValidator ,updateReportValidator, deleteReportValidator } = require("../utils/validators/reportValidator")

const { getReports ,createReport, getReport, updateReport, deleteReport } = require("../controllers/reportController");

const router = express.Router({mergeParams:true});

router.route('/').get(getReports)
    .post(createReportValidator,createReport);

router.route('/:id')
    //getReportValidator validation layer  rule call validator 
    .get(getReportValidator, getReport)
    .put(updateReportValidator, updateReport)
    .delete (deleteReportValidator, deleteReport);

module.exports = router;