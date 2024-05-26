const express = require("express");
const router = express.Router();
var globalService = require("../Services/global");

router
  // Validation
  // .use('*', globalService.checkAuthorization)
  // .use("/api", globalService.checkToken)

  // Admin
  .use("/api/user", require("./Masters/user"))
  .post("/user/login", require("../Services/Masters/user").login)

  // Web Forms
  .use("/api/banner", require("./Masters/banner"))
  .use("/api/events", require("./Masters/events"))
  .use("/banner/get", require("../Services/Masters/banner").get)
  .use("/events/get", require("../Services/Masters/events").get)

  // Masters Forms
  .use('/api/plan', require('./Masters/plan'))
  .use('/api/animalBreed', require('./Masters/animalBreed'))
  .use('/api/animalType', require('./Masters/animalType'))
  .use('/api/caseType', require('./Masters/caseType'))
  .use('/api/university', require('./Masters/university'))
  .use('/api/district', require('./Masters/district'))
  .use('/api/taluka', require('./Masters/taluka'))
  .use('/api/cast', require('./Masters/cast'))
  .use('/api/animalSample', require('./Masters/animalSample'))
  .use('/api/notice', require('./Masters/notice'))

  // Member Forms
  .use('/api/member', require('./MemberManagement/member'))
  .use('/api/memberPlanMapping', require('./MemberManagement/memberPlanMapping'))
  .post("/member/login", require("../Services/MemberManagement/member").login)
  .post("/member/sendRegistrationOtp", require("../Services/MemberManagement/member").sendRegistrationOtp)
  .post("/member/verifyRegistrationOtp", require("../Services/MemberManagement/member").verifyRegistrationOtp)
  .post("/member/sendForgotOtp", require("../Services/MemberManagement/member").sendForgotOtp)
  .post("/member/verifyForgotOtp", require("../Services/MemberManagement/member").verifyForgotOtp)
  .post("/member/changePassword", require("../Services/MemberManagement/member").changePassword)

  // Patient Activity Forms
  .use('/api/patientDailyCheckup', require('./PatientManagement/patientDailyCheckup'))
  .use('/api/patientHistory', require('./PatientManagement/patientHistory'))
  .use('/api/patient', require('./PatientManagement/patient'))
  .use('/api/aiDetails', require('./PatientManagement/aiDetails'))
  .use('/api/vaccinationDetails', require('./PatientManagement/vaccinationDetails'))

  // Reports
  .use('/api/summary', require('./Reports/summary'))

  // Upload Files
  .post("/upload/events", globalService.events)
  .post("/upload/banners", globalService.banners)
  .post("/upload/experienceLetter", globalService.experienceLetter)
  .post("/upload/panCard", globalService.panCard)
  .post("/upload/adharCard", globalService.adharCard)
  .post("/upload/profilePhoto", globalService.profilePhoto)
  .post("/upload/educationalCretificate", globalService.educationalCretificate)
  .post("/upload/leavingCretificate", globalService.leavingCretificate)
  .post("/upload/memberSign", globalService.memberSign)
  .post("/upload/ownerSign", globalService.ownerSign)
  .post("/upload/patientImage", globalService.patientImage)
  .post("/upload/animalType", globalService.animalType)
  .post("/upload/notice", globalService.notice)


module.exports = router;