const express = require('express');
const router = express.Router();
const districtService = require('../../Services/Masters/district');

router
    .post('/get', districtService.get)
    .post('/create',  districtService.create)
    .put('/update',  districtService.update)

module.exports = router;