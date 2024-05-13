const express = require('express');
const router = express.Router();
const animalSampleService = require('../../Services/Masters/animalSample.js');

router
    .post('/get', animalSampleService.get)
    .post('/create', animalSampleService.create)
    .put('/update', animalSampleService.update)

module.exports = router;