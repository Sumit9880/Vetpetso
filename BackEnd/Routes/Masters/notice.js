const express = require('express');
const router = express.Router();
const noticeService = require('../../Services/Masters/notice.js');

router
    .post('/get', noticeService.get)
    .post('/create', noticeService.create)
    .put('/update', noticeService.update)

module.exports = router;