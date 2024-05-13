const express = require('express');
const router = express.Router();
const vaccinationDetailsService = require('../../Services/PatientManagement/vaccinationDetails');

router
    .post('/get', vaccinationDetailsService.get)
    .post('/create', vaccinationDetailsService.validate(), vaccinationDetailsService.create)
    .put('/update', vaccinationDetailsService.validate(), vaccinationDetailsService.update)

module.exports = router;