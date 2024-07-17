const express = require('express');
const router = express.Router();
const galleryService = require('../../Services/Masters/gallery');

router
    .post('/get', galleryService.get)
    .post('/create', galleryService.validate(), galleryService.create)
    .put('/update', galleryService.validate(), galleryService.update)

module.exports = router;