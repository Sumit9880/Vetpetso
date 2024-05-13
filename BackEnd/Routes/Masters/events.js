const express = require('express');
const router = express.Router();
const eventsService = require('../../Services/Masters/events');

router
    .post('/get', eventsService.get)
    .post('/create', eventsService.validate(), eventsService.create)
    .put('/update', eventsService.validate(), eventsService.update)
    
module.exports = router;