const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { validationResult, body } = require('express-validator');
const { logError } = require('../../Modules/logger');

function reqData(req) {
    var data = {
        PATIENT_ID: req.body.PATIENT_ID,
        OBSERVATION_DATE: req.body.OBSERVATION_DATE,
        PRESCRIPTION : req.body.PRESCRIPTION,
        OBSERVATION_AND_FINDINGS: req.body.OBSERVATION_AND_FINDINGS,
        TREATMENT_AND_SUGGESTION: req.body.TREATMENT_AND_SUGGESTION,
        REMARKS: req.body.REMARKS
    }
    return data;
}

exports.validate = function () {
    return [
        body('PATIENT_ID', 'PATIENT_ID parameter missing').exists(),
        body('OBSERVATION_DATE', 'OBSERVATION_DATE parameter missing').exists().isISO8601(),
        body('OBSERVATION_AND_FINDINGS', 'OBSERVATION_AND_FINDINGS parameter missing').exists(),
        body('TREATMENT_AND_SUGGESTION', 'TREATMENT_AND_SUGGESTION parameter missing').exists(),
        body('REMARKS', 'REMARKS parameter missing').exists(),
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
        dm.runQuery('select count(*) as cnt from view_patient_daily_checkup_details where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get patientDailyCheckup count.",
                });
            }
            else {
                dm.runQuery('select * from view_patient_daily_checkup_details where 1 ' + criteria, req, (error, results) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get patientDailyCheckup information."
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
    data.OBSERVATION_DATE = bm.getSystemDate();
    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {
            dm.runDataQuery('INSERT INTO patient_daily_checkup_details SET ?', data, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save patientDailyCheckup information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "patientDailyCheckup information saved successfully...",
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
            "message": errors.errors
        });
    }
    else {
        try {
            dm.runDataQuery(`UPDATE patient_daily_checkup_details SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update patientDailyCheckup information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "patientDailyCheckup information updated successfully...",
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