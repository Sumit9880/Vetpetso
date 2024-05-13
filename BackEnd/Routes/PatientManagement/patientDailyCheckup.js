const express = require('express');
const router = express.Router();
const patientDailyCheckupService = require('../../Services/PatientManagement/patientDailyCheckup');

router
    .post('/get', patientDailyCheckupService.get)
    .post('/create', patientDailyCheckupService.create)
    .put('/update', patientDailyCheckupService.validate(), patientDailyCheckupService.update)

module.exports = router;