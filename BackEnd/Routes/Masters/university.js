const express = require('express');
const router = express.Router();
const universityService = require('../../Services/Masters/university');

router
    .post('/get', universityService.get)
    .post('/create', universityService.validate(), universityService.create)
    .put('/update', universityService.validate(), universityService.update)

module.exports = router;