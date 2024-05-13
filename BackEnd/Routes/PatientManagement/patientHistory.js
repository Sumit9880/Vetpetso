const express = require('express');
const router = express.Router();
const patientHistryService = require('../../Services/PatientManagement/patientHistory');

router
    .post('/get', patientHistryService.get)
    .post('/create', patientHistryService.validate(), patientHistryService.create)
    .put('/update', patientHistryService.validate(), patientHistryService.update)

module.exports = router;