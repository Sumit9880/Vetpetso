const express = require('express');
const router = express.Router();
const memberService = require('../../Services/MemberManagement/member');

router
    .post('/get', memberService.get)
    .post('/getData', memberService.getData)
    .post('/create',  memberService.create)
    .put('/update', memberService.update)
    .post('/approveReject', memberService.approveReject)
    .post('/register',  memberService.register)

module.exports = router;