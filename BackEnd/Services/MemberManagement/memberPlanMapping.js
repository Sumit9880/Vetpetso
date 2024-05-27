const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { validationResult, body } = require('express-validator');
const { logError } = require('../../Modules/logger');


function reqData(req) {
    var data = {
        PLAN_ID: req.body.PLAN_ID,
        MEMBER_ID: req.body.MEMBER_ID,
        TAKEN_DATETIME: req.body.TAKEN_DATETIME,
        END_DATE: req.body.END_DATE,
        STATUS: req.body.STATUS ? '1' : '0',
    }
    return data;
}

exports.validate = function () {
    return [
        body('PLAN_ID', ' parameter missing').exists(),
        body('MEMBER_ID', ' parameter missing').exists(),
        body('TAKEN_DATETIME', ' parameter missing').exists(),
        body('END_DATE', ' parameter missing').exists(),
        body('STATUS', ' parameter missing').exists(),
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
        dm.runQuery('select count(*) as cnt from view_member_plan_mapping where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get planMapping count.",
                });
            }
            else {
                dm.runQuery('select * from view_member_plan_mapping where 1 ' + criteria, req, (error, results) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get planMapping information."
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
            "message": errors.errors
        });
    }
    else {
        try {
            dm.runDataQuery('INSERT INTO member_plan_mapping SET ?', data, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Plan Mapping information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Plan Mapping information saved successfully...",
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
            dm.runDataQuery(`UPDATE member_plan_mapping SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Plan Mapping information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Plan Mapping information updated successfully...",
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


exports.mapPlan = (req, res) => {

    var data = reqData(req);
    const errors = validationResult(req);
    let TYPE = req.body.TYPE
    if (!errors.isEmpty()) {
        console.error(errors);
        res.send({
            "code": 422,
            "message": errors.errors
        });
    }
    else {
        try {
            data.TAKEN_DATETIME = bm.getSystemDate();
            data.STATUS = '1';
            if (TYPE == 'Y') {
                let currentDate = new Date();
                let month = currentDate.getMonth();
                let year = currentDate.getFullYear();
                if (month <= 2) {
                    data.END_DATE = `${year}-03-31`;
                } else {
                    data.END_DATE = `${year + 1}-03-31`;
                }
            }

            console.log(data.END_DATE);
            dm.runDataQuery('UPDATE member_plan_mapping SET STATUS = 0 WHERE MEMBER_ID = ?', [data.MEMBER_ID], req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Plan Mapping information..."
                    });
                } else {
                    dm.runDataQuery('INSERT INTO member_plan_mapping SET ?', data, req, (error, results) => {
                        if (error) {
                            console.error(error);
                            res.send({
                                "code": 400,
                                "message": "Failed to save Plan Mapping information..."
                            });
                        } else {
                            res.send({
                                "code": 200,
                                "message": "Plan Mapping information saved successfully...",
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