const express = require('express');
const router = express.Router();
const animalTypeService = require('../../Services/Masters/animalType');

router
    .post('/get', animalTypeService.get)
    .post('/create', animalTypeService.validate(), animalTypeService.create)
    .put('/update', animalTypeService.validate(), animalTypeService.update)

module.exports = router;