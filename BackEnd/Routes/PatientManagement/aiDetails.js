const express = require('express');
const router = express.Router();
const aiDetailsService = require('../../Services/PatientManagement/aiDetails');

router
    .post('/get', aiDetailsService.get)
    .post('/create', aiDetailsService.validate(), aiDetailsService.create)
    .put('/update', aiDetailsService.update)

module.exports = router;