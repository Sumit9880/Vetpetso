const express = require('express');
const router = express.Router();
const historyService = require('../../Services/Masters/history');

router
    .post('/get', historyService.get)
    .post('/create', historyService.validate(), historyService.create)
    .put('/update', historyService.validate(), historyService.update)

module.exports = router;