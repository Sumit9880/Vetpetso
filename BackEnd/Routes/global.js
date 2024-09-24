const express = require("express");
const router = express.Router();
var globalService = require("../Services/global");

router
  // Validation
  .use('*', globalService.checkAuthorization)
  .use("/api", globalService.checkToken)

  // Admin
  .use("/api/user", require("./Masters/user"))
  .post("/user/login", require("../Services/Masters/user").login)

  // Web Forms
  .use("/api/banner", require("./Masters/banner"))
  .use("/api/events", require("./Masters/events"))
  .use("/api/history", require("./Masters/history"))
  .use("/api/gallery", require("./Masters/gallery"))
  .use("/api/commitee", require("./Masters/commitee"))
  .use("/api/contactUs", require("./Masters/contactUs"))

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
  .use('/api/semenCompany', require('./Masters/semenCompany'))

  // Member Forms
  .use('/api/member', require('./MemberManagement/member'))
  .use('/api/memberPlanMapping', require('./MemberManagement/memberPlanMapping'))
  .post("/member/login", require("../Services/MemberManagement/member").login)
  .post("/member/register", require("../Services/MemberManagement/member").register)
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

  // Open APIs
  .post("/banner/get", require("../Services/Masters/banner").get)
  .post("/events/get", require("../Services/Masters/events").get)
  .post("/cast/get", require("../Services/Masters/cast").get)
  .post("/taluka/get", require("../Services/Masters/taluka").get)
  .post("/university/get", require("../Services/Masters/university").get)
  .post("/district/get", require("../Services/Masters/district").get)
  .post("/member/get", require("../Services/MemberManagement/member").get)
  .post("/history/get", require("../Services/Masters/history").get)
  .post("/gallery/get", require("../Services/Masters/gallery").get)
  .post("/commitee/get", require("../Services/Masters/commitee").get)
  .post("/summary/getDashboardCount", require("../Services/Reports/summary").getDashboardCount)
  .post("/contactUs/create", require("../Services/Masters/contactUs").create)

  // Reports
  .use('/api/detailed', require('./Reports/detailed'))
  .use('/api/summary', require('./Reports/summary'))

  // Upload Files
  .post("/upload/animalType", globalService.animalType)
  .post("/upload/banners", globalService.banners)
  .post("/upload/commitee", globalService.commitee)
  .post("/upload/gallery", globalService.gallery)
  .post("/upload/history", globalService.history)
  .post("/upload/events", globalService.events)
  .post("/upload/notice", globalService.notice)
  .post("/upload/planImage", globalService.planImage)

  .post("/upload/adharCard", globalService.adharCard)
  .post("/upload/educationalCretificate", globalService.educationalCretificate)
  .post("/upload/experienceLetter", globalService.experienceLetter)
  .post("/upload/leavingCretificate", globalService.leavingCretificate)
  .post("/upload/memberSign", globalService.memberSign)
  .post("/upload/ownerSign", globalService.ownerSign)
  .post("/upload/panCard", globalService.panCard)
  .post("/upload/patientImage", globalService.patientImage)
  .post("/upload/profilePhoto", globalService.profilePhoto)


module.exports = router;