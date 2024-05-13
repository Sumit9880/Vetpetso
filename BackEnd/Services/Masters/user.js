const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { validationResult, body } = require('express-validator');
const { logError } = require('../../Modules/logger');


var userMaster = "user_master";
var viewuserMaster = "view_" + userMaster;


function reqData(req) {

    var data = {
        NAME: req.body.NAME,
        EMAIL_ID: req.body.EMAIL_ID,
        MOBILE_NUMBER: req.body.MOBILE_NUMBER,
        STATUS: req.body.STATUS ? '1' : '0',
        PASSWORD: req.body.PASSWORD,
        CLOUD_ID: req.body.CLOUD_ID,
        ROLE_ID: req.body.ROLE_ID

    }
    return data;
}

exports.validate = function () {
    return [
        body('NAME', ' parameter missing').exists(),
        body('EMAIL_ID', ' parameter missing').exists(),
        body('MOBILE_NUMBER', ' parameter missing').exists(),
        body('STATUS', ' parameter missing').exists(),
        body('PASSWORD', ' parameter missing').exists(),
        body('CLOUD_ID', ' parameter missing').exists(),
        body('ROLE_ID', ' parameter missing').exists(),
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
        dm.runQuery('select count(*) as cnt from ' + viewuserMaster + ' where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get userMaster count.",
                });
            }
            else {
                dm.runQuery('select * from ' + viewuserMaster + ' where 1 ' + criteria, req, (error, results) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get userMaster information."
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
            dm.runDataQuery('INSERT INTO ' + userMaster + ' SET ?', data, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save userMaster information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "userMaster information saved successfully...",
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
            dm.runDataQuery(`UPDATE user_master SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update stateMaster information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "StateMaster information updated successfully...",
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
    try {
        var username = req.body.username;
        var password = req.body.password;

        if ((!username || username == '' || username == undefined) || (!password || password == '' || password == undefined)) {
            res.send({
                "code": 400,
                "message": "username or password parameter missing",
            });
        }
        else {
            dm.runDataQuery(`SELECT ID,NAME,EMAIL_ID,MOBILE_NUMBER,ROLE_ID FROM user_master WHERE (MOBILE_NUMBER = ? or EMAIL_ID = ?) and PASSWORD = ? and STATUS = 1`, [username, username, password], req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get userMaster information."
                    });
                }
                else {
                    if (results.length > 0) {
                        bm.generateToken(results[0].ID, res, results[0]);
                    }
                    else {
                        res.send({
                            "code": 400,
                            "message": "Invalid username or password."
                        });
                    }
                }
            });
        }
    } catch (error) {
        logError(req.method, req.originalUrl, error, '', '', "CatchError");
        console.error(error);
        res.send({
            "code": 500,
            "message": "Something went wrong."
        });
    }
}



