const express = require('express');
const router = express.Router();
const detailedService = require('../../Services/Reports/detailed.js');

router
    .post('/caseReport', detailedService.caseReport)
    .post('/aiReport', detailedService.aiReport)
    .post('/vaccinationReport', detailedService.vaccinationReport)
    .post('/caseExport', detailedService.caseExport)
    .post('/aiExport', detailedService.aiExport)
    .post('/vaccinationExport', detailedService.vaccinationExport)

module.exports = router;