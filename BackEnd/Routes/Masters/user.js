const express = require('express');
const router = express.Router();
const userService = require('../../Services/Masters/user');

router
    .post('/get', userService.get)
    .post('/create', userService.validate(), userService.create)
    .put('/update', userService.validate(), userService.update)

module.exports = router;