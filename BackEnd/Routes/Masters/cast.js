const express = require('express');
const router = express.Router();
const castService = require('../../Services/Masters/cast');

router
    .post('/get', castService.get)
    .post('/create', castService.create)
    .put('/update', castService.update)

module.exports = router;