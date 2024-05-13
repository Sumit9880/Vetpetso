const express = require('express');
const router = express.Router();
const animalBreedService = require('../../Services/Masters/animalBreed');

router
    .post('/get', animalBreedService.get)
    .post('/create', animalBreedService.validate(), animalBreedService.create)
    .put('/update', animalBreedService.validate(), animalBreedService.update)

module.exports = router;