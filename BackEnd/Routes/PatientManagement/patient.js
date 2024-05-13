const express = require('express');
const router = express.Router();
const patientService = require('../../Services/PatientManagement/patient');

router
    .post('/get', patientService.get)
    .post('/create', patientService.validate(), patientService.create)
    .put('/update', patientService.validate(), patientService.update)
    .post('/addAi', patientService.validate(), patientService.addAi)
    .post('/addVaccination', patientService.validate(), patientService.addVaccination)
    .post('/add', patientService.validate(), patientService.add)

module.exports = router;