const express = require('express');
const router = express.Router();
const semenCompanyService = require('../../Services/Masters/semenCompany.js');

router
    .post('/get', semenCompanyService.get)
    .post('/create', semenCompanyService.validate(), semenCompanyService.create)
    .put('/update', semenCompanyService.validate(), semenCompanyService.update)

module.exports = router;