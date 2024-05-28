const express = require('express');
const router = express.Router();
const summaryService = require('../../Services/Reports/summary.js');

router
    .post('/getDashboardCount', summaryService.getDashboardCount)
    .post('/getMemberWiseCount', summaryService.getMemberWiseCount)
    .post('/getTypeWiseCount', summaryService.getTypeWiseCount)

module.exports = router;