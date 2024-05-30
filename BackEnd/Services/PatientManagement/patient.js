const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { validationResult, body } = require('express-validator');
const { logError } = require('../../Modules/logger');


function reqData(req) {
    var data = {
        CASE_NO: req.body.CASE_NO,
        MEMBER_ID: req.body.MEMBER_ID,
        REGISTRATION_DATE: req.body.REGISTRATION_DATE,
        ANIMAL_IDENTITY_NO: req.body.ANIMAL_IDENTITY_NO,
        OWNER_NAME: req.body.OWNER_NAME,
        ADHAR_NO: req.body.ADHAR_NO,
        ADDRESS: req.body.ADDRESS,
        AT_POST: req.body.AT_POST,
        TALUKA: req.body.TALUKA,
        DISTRICT: req.body.DISTRICT,
        LOCATION: req.body.LOCATION,
        CASE_TYPE: req.body.CASE_TYPE,
        ANIMAL_TYPE: req.body.ANIMAL_TYPE,
        BREED: req.body.BREED,
        ANIMAL_AGE: req.body.ANIMAL_AGE,
        MOBILE_NUMBER: req.body.MOBILE_NUMBER,
        OWNER_SIGN: req.body.OWNER_SIGN,
        DISCHARGE_DATE: req.body.DISCHARGE_DATE,
        DISCHARGE_REMARK: req.body.DISCHARGE_REMARK,
        PATIENT_IMAGE: req.body.PATIENT_IMAGE,
        IS_CLOSED: req.body.IS_CLOSED ? '1' : '0'
    }
    return data;
}

function historyReqData(req) {
    var data = {
        PATIENT_ID: req.body.PATIENT_ID,
        TEMPERATURE: req.body.TEMPERATURE,
        ABDOMINAL_MOVEMENT: req.body.ABDOMINAL_MOVEMENT,
        PULSE: req.body.PULSE,
        GENITAL_CONDITION: req.body.GENITAL_CONDITION,
        RESPIRATORY_CONDITION: req.body.RESPIRATORY_CONDITION,
        OBSERVATION_OF_EYE_SKIN_NOSTRIL: req.body.OBSERVATION_OF_EYE_SKIN_NOSTRIL,
        WATER_INTAKE: req.body.WATER_INTAKE,
        DID_TAKE_ANTISEPTIC_DRUGS: req.body.DID_TAKE_ANTISEPTIC_DRUGS,
        DID_MAKE_HOME_REMEDIES: req.body.DID_MAKE_HOME_REMEDIES,
        OTHER_INFORMATION: req.body.OTHER_INFORMATION,
        IMMUNIZATION_INFORMATION: req.body.IMMUNIZATION_INFORMATION,
        FIRST_AID: req.body.FIRST_AID,
        PATIENT_SAMPLES: req.body.PATIENT_SAMPLES,
        DIAGNOSTIC_LABORATORY_REMARK: req.body.DIAGNOSTIC_LABORATORY_REMARK,
        INSTRUCTIONS_TO_OWNER: req.body.INSTRUCTIONS_TO_OWNER
    }
    return data;
}

exports.validate = function () {
    return [
        body('ANIMAL_IDENTITY_NO', 'ANIMAL_IDENTITY_NO parameter missing').exists(),
        body('MEMBER_ID', 'MEMBER_ID parameter missing').exists(),
        body('AT_POST', 'AT_POST parameter missing').exists(),
        body('TALUKA', 'TALUKA parameter missing').exists(),
        body('DISTRICT', 'DISTRICT parameter missing').exists(),
        body('CASE_TYPE', 'CASE_TYPE parameter missing').exists(),
        body('BREED', 'BREED parameter missing').exists(),
        body('OWNER_NAME', 'OWNER_NAME parameter missing').exists(),
        body('ADDRESS', 'ADDRESS parameter missing').exists(),
        body('MOBILE_NUMBER', 'MOBILE_NUMBER parameter missing').exists(),
        body('OWNER_SIGN', 'OWNER_SIGN parameter missing').exists(),
        body('DISCHARGE_DATE', 'DISCHARGE_DATE parameter missing').optional(),
        body('DISCHARGE_REMARK', 'DISCHARGE_REMARK parameter missing').optional(),
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
        dm.runQuery('select count(*) as cnt from view_patient_master where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Patient count.",
                });
            }
            else {
                dm.runQuery('select * from view_patient_master where 1 ' + criteria, req, (error, results) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get Patient information."
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
            dm.runDataQuery('INSERT INTO patient_master SET ?', data, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Patient information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Patient information saved successfully...",
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
            dm.runDataQuery(`UPDATE patient_master SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Patient information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Patient information updated successfully...",
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

exports.addAi = async (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    data.REGISTRATION_DATE = bm.getSystemDate();
    data.CASE_NO = 'AI' + req.body.MEMBER_ID
    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": "Parameter Missing " + errors.errors.map(error => error.path)
        });
    }
    else {
        try {
            const connection = await dm.getConnection();
            dm.runDMLQuery('SELECT CASE_NO FROM `patient_master` ORDER BY CASE_NO DESC LIMIT 1', '', connection, req, (error, results) => {
                if (error) {
                    console.error(error);
                    dm.rollback(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Patient information..."
                    });
                } else {
                    if (results[0]?.CASE_NO > 0) {
                        data.CASE_NO = (parseInt(results[0].CASE_NO) + 1)
                    } else {
                        data.CASE_NO = 1
                    }
                    dm.runDMLQuery('INSERT INTO patient_master SET ?', data, connection, req, (error, results) => {
                        if (error) {
                            console.error(error);
                            dm.rollback(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save Patient information..."
                            });
                        } else {
                            dm.runDMLQuery('INSERT INTO ai_details SET PATIENT_ID = ?', [results.insertId], connection, req, (error, results1) => {
                                if (error) {
                                    console.error(error);
                                    dm.rollback(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to save Ai information..."
                                    });
                                } else {
                                    dm.commit(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Patient information saved successfully...",
                                    });
                                }
                            })
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
}

exports.addVaccination = async (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    data.REGISTRATION_DATE = bm.getSystemDate();
    let TYPE = req.body.TYPE
    let NAME = req.body.NAME
    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": "Parameter Missing " + errors.errors.map(error => error.path)
        });
    }
    else {
        try {
            const connection = await dm.getConnection();
            dm.runDMLQuery('SELECT CASE_NO FROM `patient_master` ORDER BY CASE_NO DESC LIMIT 1', '', connection, req, (error, results) => {
                if (error) {
                    console.error(error);
                    dm.rollback(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Patient information..."
                    });
                } else {
                    if (results[0]?.CASE_NO > 0) {
                        data.CASE_NO = (parseInt(results[0].CASE_NO) + 1)
                    } else {
                        data.CASE_NO = 1
                    }
                    dm.runDMLQuery('INSERT INTO patient_master SET ?', data, connection, req, (error, results) => {
                        if (error) {
                            console.error(error);
                            dm.rollback(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save Patient information..."
                            });
                        } else {
                            dm.runDMLQuery('INSERT INTO vaccination_details SET PATIENT_ID = ?,TYPE = ? ,NAME = ?,DOSE_NUMBER = ?', [results.insertId, TYPE, NAME, 1], connection, req, (error, results1) => {
                                if (error) {
                                    console.error(error);
                                    dm.rollback(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to save Vaccination information..."
                                    });
                                } else {
                                    dm.commit(connection);
                                    res.send({
                                        "code": 200,
                                        "message": "Patient information saved successfully...",
                                    });
                                }
                            })
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
}

exports.add = async (req, res) => {
    console.log(req.body);
    var data = reqData(req);
    let historyData = historyReqData(req);
    const errors = validationResult(req);
    let systemDate = bm.getSystemDate();
    data.REGISTRATION_DATE = systemDate
    let checkupDetails = req.body.checkupDetails[0];

    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": "Parameter Missing " + errors.errors.map(error => error.path)
        });
    }
    else {
        try {
            const connection = await dm.getConnection();
            dm.runDMLQuery('SELECT CASE_NO FROM `patient_master` ORDER BY CASE_NO DESC LIMIT 1', '', connection, req, (error, results) => {
                if (error) {
                    console.error(error);
                    dm.rollback(connection);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Patient information..."
                    });
                } else {
                    if (results[0]?.CASE_NO > 0) {
                        data.CASE_NO = (parseInt(results[0].CASE_NO) + 1)
                    } else {
                        data.CASE_NO = 1
                    }
                    dm.runDMLQuery('INSERT INTO patient_master SET ?', data, connection, req, (error, results) => {
                        if (error) {
                            console.error(error);
                            dm.rollback(connection);
                            res.send({
                                "code": 400,
                                "message": "Failed to save Patient information..."
                            });
                        } else {
                            historyData.PATIENT_ID = results.insertId
                            dm.runDMLQuery('INSERT INTO patient_history SET ?', historyData, connection, req, (error, results1) => {
                                if (error) {
                                    console.error(error);
                                    dm.rollback(connection);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to save Patient History information..."
                                    });
                                } else {
                                    if (checkupDetails != {} && checkupDetails?.OBSERVATION_AND_FINDINGS) {
                                        dm.runDMLQuery('INSERT INTO patient_daily_checkup_details (PATIENT_ID,OBSERVATION_DATE,OBSERVATION_AND_FINDINGS,PRESCRIPTION,TREATMENT_AND_SUGGESTION,REMARKS) VALUES (?,?,?,?,?,?)', [results.insertId, systemDate, checkupDetails.OBSERVATION_AND_FINDINGS, checkupDetails.PRESCRIPTION, checkupDetails.TREATMENT_AND_SUGGESTION, checkupDetails.REMARKS], connection, req, (error, results2) => {
                                            if (error) {
                                                console.error(error);
                                                dm.rollback(connection);
                                                res.send({
                                                    "code": 400,
                                                    "message": "Failed to save Checkup information..."
                                                });
                                            } else {
                                                dm.commit(connection);
                                                res.send({
                                                    "code": 200,
                                                    "message": "Patient information saved successfully...",
                                                });
                                            }
                                        })
                                    } else {
                                        dm.rollback(connection);
                                        res.send({
                                            "code": 300,
                                            "message": "Please fill checkkup details",
                                        });
                                    }

                                }
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
}
