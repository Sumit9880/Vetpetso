const express = require('express');
const router = express.Router();
const memberService = require('../../Services/MemberManagement/memberPlanMapping');

router
    .post('/get', memberService.get)
    .post('/create', memberService.create)
    .put('/update', memberService.update)
    .post('/mapPlan', memberService.mapPlan)

module.exports = router;