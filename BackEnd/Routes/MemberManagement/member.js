const express = require('express');
const router = express.Router();
const memberService = require('../../Services/MemberManagement/member');

router
    .post('/get', memberService.get)
    .post('/create',  memberService.create)
    .put('/update', memberService.update)
    .post('/approveReject', memberService.approveReject)

module.exports = router;