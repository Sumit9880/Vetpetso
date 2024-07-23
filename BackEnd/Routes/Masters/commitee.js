const express = require('express');
const router = express.Router();
const commiteeService = require('../../Services/Masters/commitee.js');

router
    .post('/get', commiteeService.get)
    .post('/create', commiteeService.validate(), commiteeService.create)
    .put('/update', commiteeService.validate(), commiteeService.update)
    
module.exports = router;