const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { validationResult, body } = require('express-validator');
const { logError } = require('../../Modules/logger');


function reqData(req) {
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
        body('PATIENT_ID', 'PATIENT_ID parameter missing').exists(),
        body('TEMPERATURE', 'TEMPERATURE parameter missing').exists(),
        body('ABDOMINAL_MOVEMENT', 'ABDOMINAL_MOVEMENT parameter missing').exists(),
        body('PULSE', 'PULSE parameter missing').exists(),
        body('GENITAL_CONDITION', 'GENITAL_CONDITION parameter missing').exists(),
        body('RESPIRATORY_CONDITION', 'RESPIRATORY_CONDITION parameter missing').exists(),
        body('OBSERVATION_OF_EYE_SKIN_NOSTRIL', 'OBSERVATION_OF_EYE_SKIN_NOSTRIL parameter missing').exists(),
        body('WATER_INTAKE', 'WATER_INTAKE parameter missing').exists(),
        body('DID_TAKE_ANTISEPTIC_DRUGS', 'DID_TAKE_ANTISEPTIC_DRUGS parameter missing').exists(),
        body('DID_MAKE_HOME_REMEDIES', 'DID_MAKE_HOME_REMEDIES parameter missing').exists(),
        body('OTHER_INFORMATION', 'OTHER_INFORMATION parameter missing').exists(),
        body('IMMUNIZATION_INFORMATION', 'IMMUNIZATION_INFORMATION parameter missing').exists(),
        body('FIRST_AID', 'FIRST_AID parameter missing').exists(),
        body('PATIENT_SAMPLES', 'PATIENT_SAMPLES parameter missing').exists(),
        body('DIAGNOSTIC_LABORATORY_REMARK', 'DIAGNOSTIC_LABORATORY_REMARK parameter missing').exists(),
        body('INSTRUCTIONS_TO_OWNER', 'INSTRUCTIONS_TO_OWNER parameter missing').exists(),
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
        dm.runQuery('select count(*) as cnt from view_patient_history where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get patientHistory count.",
                });
            }
            else {
                dm.runQuery('select * from view_patient_history where 1 ' + criteria, req, (error, results) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get patientHistory information."
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
            dm.runDataQuery('INSERT INTO patient_history SET ?', data, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save patientHistory information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "patientHistory information saved successfully...",
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
            dm.runDataQuery(`UPDATE patient_history SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update patientHistory information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "patientHistory information updated successfully...",
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