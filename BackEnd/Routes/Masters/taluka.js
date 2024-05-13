const express = require('express');
const router = express.Router();
const talukaService = require('../../Services/Masters/taluka');

router
    .post('/get', talukaService.get)
    .post('/create',  talukaService.create)
    .put('/update',  talukaService.update)

module.exports = router;