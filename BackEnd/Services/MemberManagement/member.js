const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { validationResult, body } = require('express-validator');
const { logError } = require('../../Modules/logger');


function reqData(req) {
    var data = {
        NAME: req.body.NAME,
        ADDRESS: req.body.ADDRESS,
        MOBILE_NUMBER: req.body.MOBILE_NUMBER,
        EMAIL: req.body.EMAIL,
        DATE_OF_BIRTH: req.body.DATE_OF_BIRTH,
        PIN_CODE: req.body.PIN_CODE,
        FATHER_NAME: req.body.FATHER_NAME,
        VILLAGE: req.body.VILLAGE,
        TALUKA: req.body.TALUKA,
        DISTRICT: req.body.DISTRICT,
        CAST: req.body.CAST,
        SUB_CAST: req.body.SUB_CAST,
        DURATION_OF_CURRENT_ADDRESS: req.body.DURATION_OF_CURRENT_ADDRESS,
        EDUCATIONAL_QUALIFICATION: req.body.EDUCATIONAL_QUALIFICATION,
        PROF_EDUCATION_QUALIFICATION: req.body.PROF_EDUCATION_QUALIFICATION,
        VET_STOCKMAN_TRANING_COURSE: req.body.VET_STOCKMAN_TRANING_COURSE,
        LIVESTOCK_SUPERVISOR_COURSE: req.body.LIVESTOCK_SUPERVISOR_COURSE,
        DAIRY_BUSSINES_MANAGEMENT: req.body.DAIRY_BUSSINES_MANAGEMENT,
        DIPLOMA_IN_VETERINARY_MEDICINE: req.body.DIPLOMA_IN_VETERINARY_MEDICINE,
        WORKING_CITY: req.body.WORKING_CITY,
        WORKING_TALUKA: req.body.WORKING_TALUKA,
        WORKING_DISTRICT: req.body.WORKING_DISTRICT,
        WORKING_CITY_PINCODE: req.body.WORKING_CITY_PINCODE,
        WORK_MOBILE_NUMBER: req.body.WORK_MOBILE_NUMBER,
        WORK_EMAIL_ID: req.body.WORK_EMAIL_ID,
        WORK_DURATION: req.body.WORK_DURATION,
        INTERESTED_PLACES_TO_WORK: req.body.INTERESTED_PLACES_TO_WORK,
        APPLICATION_DATE_TIME: req.body.APPLICATION_DATE_TIME,
        APPLICATION_PLACE: req.body.APPLICATION_PLACE,
        CONCENTERS_NAME: req.body.CONCENTERS_NAME,
        CONCENTERS_ADDRESS: req.body.CONCENTERS_ADDRESS,
        CONCENTERS_MOBILE_NUMBER: req.body.CONCENTERS_MOBILE_NUMBER,
        LEAVING_CERTIFICATE: req.body.LEAVING_CERTIFICATE,
        EDUCATIONAL_CERTIFICATE: req.body.EDUCATIONAL_CERTIFICATE,
        PROFILE_PHOTO: req.body.PROFILE_PHOTO,
        ADHAR_CARD: req.body.ADHAR_CARD,
        PAN_CARD: req.body.PAN_CARD,
        EXPERIENCE_LETTER: req.body.EXPERIENCE_LETTER,
        APPLICATION_NO: req.body.APPLICATION_NO,
        EXECUTIVE_MEETING_DATE: req.body.EXECUTIVE_MEETING_DATE,
        IS_APPROVED_BY_PRESIDENCY: req.body.IS_APPROVED_BY_PRESIDENCY,
        IS_APPROVED_CHAIRMAN: req.body.IS_APPROVED_CHAIRMAN,
        IS_APPROVED_EXECUTIVE: req.body.IS_APPROVED_EXECUTIVE,
        REJECTED_REMARK: req.body.REJECTED_REMARK,
        STATUS: req.body.STATUS,
        IS_ACTIVE: req.body.IS_ACTIVE ? '1' : '0',
        APPROVED_DATE: req.body.APPROVED_DATE,
        PASSWORD: req.body.PASSWORD,
        MEMBER_SIGN: req.body.MEMBER_SIGN,
        MEMBER_REGISTRATION_NO: req.body.MEMBER_REGISTRATION_NO

    }
    return data;
}

exports.validate = function () {
    return [
        body('NAME', 'NAME parameter missing').exists(),
        body('ADDRESS', 'ADDRESS parameter missing').exists(),
        body('TELEPHONE_NUMBER', 'TELEPHONE_NUMBER parameter missing').exists(),
        body('EMAIL', 'EMAIL parameter missing').exists(),
        body('DATE_OF_BIRTH', 'DATE_OF_BIRTH parameter missing').exists(),
        body('PIN_CODE', 'PIN_CODE parameter missing').exists(),
        body('FATHER_NAME', 'FATHER_NAME parameter missing').exists(),
        body('VILLAGE_NAME', 'VILLAGE_NAME parameter missing').exists(),
        body('TALUKA', 'TALUKA parameter missing').exists(),
        body('DISTRICT', 'DISTRICT parameter missing').exists(),
        body('CAST', 'CAST parameter missing').exists(),
        body('SUB_CAST', 'SUB_CAST parameter missing').exists(),
        body('DURATION_OF_CURRENT_ADDRESS', 'DURATION_OF_CURRENT_ADDRESS parameter missing').exists(),
        body('EDUCATIONAL_QUALIFICATION', 'EDUCATIONAL_QUALIFICATION parameter missing').exists(),
        body('PROF_EDUCATION_QUALIFICATION', 'PROF_EDUCATION_QUALIFICATION parameter missing').exists(),
        body('VET_STOCKMAN_TRANING_COURSE', 'VET_STOCKMAN_TRANING_COURSE parameter missing').exists(),
        body('LIVESTOCK_SUPERVISOR_COURSE', 'LIVESTOCK_SUPERVISOR_COURSE parameter missing').exists(),
        body('DAIRY_BUSSINES_MANAGEMENT', 'DAIRY_BUSSINES_MANAGEMENT parameter missing').exists(),
        body('DIPLOMA_IN_VETERINARY_MEDICINE', 'DIPLOMA_IN_VETERINARY_MEDICINE parameter missing').exists(),
        body('WORKING_CITY', 'WORKING_CITY parameter missing').exists(),
        body('WORKING_TALUKA', 'WORKING_TALUKA parameter missing').exists(),
        body('WORKING_DISTRICT', 'WORKING_DISTRICT parameter missing').exists(),
        body('WORKING_CITY_PINCODE', 'WORKING_CITY_PINCODE parameter missing').exists(),
        body('WORK_MOBILE_NUMBER', 'WORK_MOBILE_NUMBER parameter missing').exists(),
        body('WORK_EMAIL_ID', 'WORK_EMAIL_ID parameter missing').exists().isEmail(),
        body('WORK_DURATION', 'WORK_DURATION parameter missing').exists(),
        body('INTERESTED_PLACES_TO_WORK', 'INTERESTED_PLACES_TO_WORK parameter missing').exists(),
        body('APPLICATION_DATE_TIME', 'APPLICATION_DATE_TIME parameter missing').exists(),
        body('APPLICATION_PLACE', 'APPLICATION_PLACE parameter missing').exists(),
        body('CONCENTERS_NAME', 'CONCENTERS_NAME parameter missing').exists(),
        body('CONCENTERS_ADDRESS', 'CONCENTERS_ADDRESS parameter missing').exists(),
        body('CONCENTERS_PHONE_NUMBER', 'CONCENTERS_PHONE_NUMBER parameter missing').exists(),
        body('LEAVING_CERTIFICATE', 'LEAVING_CERTIFICATE parameter missing').exists(),
        body('EDUCATIONAL_CERTIFICATE', 'EDUCATIONAL_CERTIFICATE parameter missing').exists(),
        body('PHOTO', 'PHOTO parameter missing').exists(),
        body('ADHAR_CARD', 'ADHAR_CARD parameter missing').exists(),
        body('PAN_CARD', 'PAN_CARD parameter missing').exists(),
        body('EXPERIENCE_LETTER', 'EXPERIENCE_LETTER parameter missing').exists(),
        body('APPLICATION_NO', 'APPLICATION_NO parameter missing').exists(),
        body('EXECUTIVE_MEETING_DATE', 'EXECUTIVE_MEETING_DATE parameter missing').exists().isISO8601(),
        body('IS_APPROVED_BY_PRESIDENCY', 'IS_APPROVED_BY_PRESIDENCY parameter missing').exists(),
        body('IS_APPROVED_CHAIRMAN', 'IS_APPROVED_CHAIRMAN parameter missing').exists(),
        body('IS_APPROVED_EXECUTIVE', 'IS_APPROVED_EXECUTIVE parameter missing').exists(),
        body('ID').optional(),
    ]
}

exports.get = (req, res) => {

    var pageIndex = req.body.pageIndex ? req.body.pageIndex : '';
    var pageSize = req.body.pageSize ? req.body.pageSize : '';
    var start = 0;
    var end = 0;

    if (pageIndex != '' && pageSize != '') {
        start = (pageIndex - 1) * pageSize;
        end = pageSize;
    }

    let sortKey = req.body.sortKey ? req.body.sortKey : 'ID';
    let sortValue = req.body.sortValue ? req.body.sortValue : 'DESC';
    let filter = req.body.filter ? req.body.filter : '';

    let criteria = '';
    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by " + sortKey + " " + sortValue;
    else
        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;
    let countCriteria = filter;

    try {
        dm.runQuery('select count(*) as cnt from view_member_master where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Member count.",
                });
            }
            else {
                dm.runQuery('select * from view_member_master where 1 ' + criteria, req, (error, results) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get Member information."
                        });
                    }
                    else {
                        res.send({
                            "code": 200,
                            "message": "success",
                            "count": results1[0].cnt,
                            "data": results
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}

exports.create = (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": "Parameter Missing " + errors.errors.map(error => error.path)
        });
    }
    else {
        try {
            dm.runDataQuery('INSERT INTO member_master SET ?', data, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Member information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Member information saved successfully...",
                    });
                }
            });
        } catch (error) {
            console.error(error);
            logError(req.method, req.originalUrl, error, '', '', "CatchError");
            res.send({
                "code": 500,
                "message": "Something went wrong."
            });
        }
    }
}

exports.update = (req, res) => {
    const errors = validationResult(req);
    var data = reqData(req);
    var ID = req.body.ID
    var systemDate = bm.getSystemDate();
    var setData = "";
    var recordData = [];
    Object.keys(data).forEach(key => {
        data[key] ? setData += `${key}= ? , ` : true;
        data[key] ? recordData.push(data[key]) : true;
    });
    recordData.push(systemDate, ID);
    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": "Parameter Missing " + errors.errors.map(error => error.path)
        });
    }
    else {
        try {
            dm.runDataQuery(`SELECT ID,MOBILE_NUMBER,EMAIL FROM member_master where (MOBILE_NUMBER = ? OR EMAIL = ?) AND ID != ?;`, [data.MOBILE_NUMBER, data.EMAIL, ID], req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Member information."
                    });
                } else {
                    if (results.length > 0 && results[0].ID != null) {
                        let message = ''
                        if (results[0].MOBILE_NUMBER == data.MOBILE_NUMBER) {
                            message = 'Mobile No. already exists.'
                        }
                        if (results[0].EMAIL == data.EMAIL) {
                            message = 'Email already exists.'
                        }
                        res.send({
                            "code": 300,
                            "message": message
                        });
                    }
                    else {
                        dm.runDataQuery(`UPDATE member_master SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                            if (error) {
                                console.error(error);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to update Member information."
                                });
                            } else {
                                res.send({
                                    "code": 200,
                                    "message": "Member information updated successfully...",
                                });
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.error(error);
            logError(req.method, req.originalUrl, error, '', '', "CatchError");
            res.send({
                "code": 500,
                "message": "Something went wrong."
            });
        }
    }
}

exports.approveReject = (req, res) => {
    const errors = validationResult(req);
    var data = reqData(req);
    var ID = req.body.ID
    var systemDate = bm.getSystemDate();
    data.APPROVED_DATE = systemDate
    var setData = "";
    var recordData = [];
    Object.keys(data).forEach(key => {
        data[key] ? setData += `${key}= ? , ` : true;
        data[key] ? recordData.push(data[key]) : true;
    });
    recordData.push(systemDate, ID);
    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": "Parameter Missing " + errors.errors.map(error => error.path)
        });
    }
    else {
        try {
            dm.runDataQuery(`UPDATE member_master SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Member information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Member information updated successfully...",
                    });
                }
            });
        } catch (error) {
            console.error(error);
            logError(req.method, req.originalUrl, error, '', '', "CatchError");
            res.send({
                "code": 500,
                "message": "Something went wrong."
            });
        }
    }
}

exports.login = (req, res) => {

    var username = req.body.username;
    var password = req.body.password;

    try {
        dm.runDataQuery('select * from view_member_master where (MOBILE_NUMBER = ? or EMAIL = ?) and PASSWORD = ? and IS_ACTIVE = 1', [username, username, password], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Member information.",
                });
            }
            else {
                if (results[0]?.ID != null && results[0]?.ID != '') {
                    bm.generateToken(results[0].ID, res, results[0]);
                }
                else {
                    res.send({
                        "code": 400,
                        "message": "Invalid username or password.",
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}

exports.sendRegistrationOtp = (req, res) => {

    var MOBILE_NUMBER = req.body.MOBILE_NUMBER;
    var systemDate = bm.getSystemDate();
    try {
        dm.runDataQuery('select * from view_member_master where MOBILE_NUMBER = ? ', [MOBILE_NUMBER], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Member information.",
                });
            }
            else {
                if (results[0]?.ID != null && results[0]?.ID != '') {
                    res.send({
                        "code": 300,
                        "message": "Mobile number already registered.",
                    });
                }
                else {

                    // let otp = 123456
                    let otp = Math.floor(100000 + Math.random() * 900000);

                    dm.runDataQuery('INSERT INTO registration_otp_details (MOBILE_NUMBER,OTP,OTP_MESSAGE,REQUESTED_DATETIME,LASTUPDATED,STATUS,PURPOSE)  VALUES (?,?,?,?,?,?,?)', [MOBILE_NUMBER, otp, 'OTP', systemDate, systemDate, "P", "RG"], req, (error, results1) => {
                        if (error) {
                            console.error(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to save OTP information.",
                            });
                        }
                        else {

                            let message = otp + '  is your OTP for register in to VetPetSo. vetpetso.com'

                            bm.sendOtp(message, MOBILE_NUMBER, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to send OTP.",
                                    });
                                }
                                else {
                                    res.send({
                                        "code": 200,
                                        "message": "OTP sent successfully.",
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}

exports.verifyRegistrationOtp = (req, res) => {
    var MOBILE_NUMBER = req.body.MOBILE_NUMBER;
    var OTP = req.body.OTP;
    try {
        dm.runDataQuery('select * from registration_otp_details where MOBILE_NUMBER = ? and OTP = ? and STATUS = "P" and PURPOSE = "RG"', [MOBILE_NUMBER, OTP], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to Verify OTP .",
                });
            }
            else {
                if (results[0]?.ID != null && results[0]?.ID != '') {
                    dm.runDataQuery('UPDATE registration_otp_details SET STATUS = "V" where ID = ?', [results[0].ID], req, (error, results1) => {
                        if (error) {
                            console.error(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to Verify OTP information.",
                            });
                        }
                        else {
                            res.send({
                                "code": 200,
                                "message": "OTP verified successfully.",
                            });
                        }
                    })
                }
                else {
                    res.send({
                        "code": 400,
                        "message": "Invalid OTP.",
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}

exports.sendForgotOtp = (req, res) => {

    var MOBILE_NUMBER = req.body.MOBILE_NUMBER;
    var systemDate = bm.getSystemDate();
    try {
        dm.runDataQuery('select * from view_member_master where MOBILE_NUMBER = ? AND IS_ACTIVE = 1', [MOBILE_NUMBER], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Member information.",
                });
            }
            else {
                if (results[0]?.ID != null && results[0]?.ID != '') {

                    // let otp = 123456
                    let otp = Math.floor(100000 + Math.random() * 900000);

                    dm.runDataQuery('INSERT INTO registration_otp_details (MOBILE_NUMBER,OTP,OTP_MESSAGE,REQUESTED_DATETIME,LASTUPDATED,STATUS,PURPOSE)  VALUES (?,?,?,?,?,?,?)', [MOBILE_NUMBER, otp, 'OTP', systemDate, systemDate, "P", "PC"], req, (error, results1) => {
                        if (error) {
                            console.error(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to save OTP information.",
                            });
                        }
                        else {
                            let message = otp + '  is your Forgot Password OTP for VetPetSo. vetpetso.com'

                            bm.sendOtp(message, MOBILE_NUMBER, (error, results1) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to send OTP.",
                                    });
                                }
                                else {
                                    res.send({
                                        "code": 200,
                                        "message": "OTP sent successfully.",
                                        "ID": results[0].ID
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    res.send({
                        "code": 300,
                        "message": "Mobile Number Does not exist.",
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}

exports.verifyForgotOtp = (req, res) => {
    var MOBILE_NUMBER = req.body.MOBILE_NUMBER;
    var OTP = req.body.OTP;
    try {
        dm.runDataQuery('select * from registration_otp_details where MOBILE_NUMBER = ? and OTP = ? and STATUS = "P" and PURPOSE = "PC"', [MOBILE_NUMBER, OTP], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to Verify OTP .",
                });
            }
            else {
                if (results[0]?.ID != null && results[0]?.ID != '') {
                    dm.runDataQuery('UPDATE registration_otp_details SET STATUS = "V" where ID = ?', [results[0].ID], req, (error, results1) => {
                        if (error) {
                            console.error(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to Verify OTP information.",
                            });
                        }
                        else {
                            res.send({
                                "code": 200,
                                "message": "OTP verified successfully.",
                            });
                        }
                    })
                }
                else {
                    res.send({
                        "code": 400,
                        "message": "Invalid OTP.",
                    });
                }
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}

exports.changePassword = (req, res) => {
    let ID = req.body.ID;
    let PASSWORD = req.body.PASSWORD;
    try {
        dm.runDataQuery(`UPDATE member_master SET PASSWORD = ?, LASTUPDATED = ? where ID = ?;`, [PASSWORD, bm.getSystemDate(), ID], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to update Member information."
                });
            } else {
                res.send({
                    "code": 200,
                    "message": "Member information updated successfully...",
                });
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}

exports.register = (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    data.APPLICATION_DATE_TIME = data.APPLICATION_DATE_TIME ? data.APPLICATION_DATE_TIME : bm.getSystemDate();
    data.IS_ACTIVE = 1;
    data.STATUS = data.STATUS ? data.STATUS : 'P';
    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": "Parameter Missing " + errors.errors.map(error => error.path)
        });
    }
    else {
        try {
            dm.runDataQuery('SELECT ID,EMAIL,MOBILE_NUMBER FROM member_master where MOBILE_NUMBER = ? or EMAIL = ?;SELECT APPLICATION_NO,MEMBER_REGISTRATION_NO FROM member_master order by APPLICATION_NO desc limit 1', [data.MOBILE_NUMBER, data.EMAIL], req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Member information..."
                    });
                } else {
                    if (results[0].length > 0 && results[0][0]?.ID != null) {
                        let messange = ''
                        if (results[0][0]?.MOBILE_NUMBER == data.MOBILE_NUMBER) {
                            messange = 'Mobile Number already exist.'
                        }
                        if (results[0][0]?.EMAIL == data.EMAIL) {
                            messange = 'Email already exist.'
                        }
                        res.send({
                            "code": 300,
                            "message": messange,
                        });
                    } else {
                        data.MEMBER_REGISTRATION_NO = getNextMemberNo(results[1][0]?.MEMBER_REGISTRATION_NO ? results[1][0]?.MEMBER_REGISTRATION_NO : 'A0000');
                        data.APPLICATION_NO = results[1][0]?.APPLICATION_NO ? parseInt(results[1][0]?.APPLICATION_NO) + 1 : 1;
                        dm.runDataQuery('INSERT INTO member_master SET ?', data, req, (error, results) => {
                            if (error) {
                                console.error(error);
                                res.send({
                                    "code": 400,
                                    "message": "Failed to save Member information..."
                                });
                            } else {
                                res.send({
                                    "code": 200,
                                    "message": "Member information saved successfully...",
                                });
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.error(error);
            logError(req.method, req.originalUrl, error, '', '', "CatchError");
            res.send({
                "code": 500,
                "message": "Something went wrong."
            });
        }
    }
}

function getNextMemberNo(prevMemberNo) {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let [alphaPart, numPart] = prevMemberNo.match(/[A-Z]+|[0-9]+/g);

    if (numPart === '9999') {
        if (alphaPart === 'Z'.repeat(alphaPart.length)) {
            alphaPart = 'A'.repeat(alphaPart.length + 1);
        } else {
            let carry = 1;
            let alphaArr = alphaPart.split('').reverse();
            alphaArr = alphaArr.map((char) => {
                let idx = alphabet.indexOf(char) + carry;
                if (idx === 26) {
                    idx = 0;
                    carry = 1;
                } else {
                    carry = 0;
                }
                return alphabet[idx];
            });
            alphaPart = alphaArr.reverse().join('');
        }
        numPart = '0001';
    } else {
        numPart = String(parseInt(numPart) + 1).padStart(4, '0');
    }

    return alphaPart + numPart;
}

exports.getData = (req, res) => {
    let ID = req.body.ID;
    try {
        dm.runDataQuery('select * from view_member_master where ID = ?', [ID], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Member count.",
                });
            }
            else {
                dm.runDataQuery('select * from view_member_plan_mapping where MEMBER_ID = ? AND STATUS = 1 ORDER BY ID DESC LIMIT 1', [ID], req, (error, resultsPlan) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get Member Plan information."
                        });
                    }
                    else {
                        results[0].PLAN_DETAILS = resultsPlan.length > 0 ? resultsPlan[0] : {}
                        res.send({
                            "code": 200,
                            "message": "success",
                            "data": results,
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}