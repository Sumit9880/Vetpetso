const express = require('express');
const router = express.Router();
const caseTypeService = require('../../Services/Masters/caseType');

router
    .post('/get', caseTypeService.get)
    .post('/create', caseTypeService.validate(), caseTypeService.create)
    .put('/update', caseTypeService.validate(), caseTypeService.update)

module.exports = router;