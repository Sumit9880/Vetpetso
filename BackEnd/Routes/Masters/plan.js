const express = require('express');
const router = express.Router();
const planService = require('../../Services/Masters/plan');

router
    .post('/get', planService.get)
    .post('/create',  planService.create)
    .put('/update',  planService.update)

module.exports = router;