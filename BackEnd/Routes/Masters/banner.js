const express = require('express');
const router = express.Router();
const bannerService = require('../../Services/Masters/banner');

router
    .post('/get', bannerService.get)
    .post('/create', bannerService.validate(), bannerService.create)
    .put('/update', bannerService.validate(), bannerService.update)
    .post('/remove', bannerService.remove)

module.exports = router;