const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { validationResult, body } = require('express-validator');
const { logError } = require('../../Modules/logger');
const fs = require('fs');
const path = require('path');


function reqData(req) {
    var data = {
        NAME: req.body.NAME,
        URL: req.body.URL,
        STATUS: req.body.STATUS ? '1' : '0'
    }
    return data;
}

exports.validate = function () {
    return [
        body('NAME', ' parameter missing').exists(),
        body('URL', ' parameter missing').exists(),
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
        dm.runQuery('select count(*) as cnt from view_banner_master where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Banner count.",
                });
            }
            else {
                dm.runQuery('select * from view_banner_master where 1 ' + criteria, req, (error, results) => {
                    if (error) {
                        console.error(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get Banner information."
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
            dm.runDataQuery('INSERT INTO banner_master SET ?', data, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to save Banner information..."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Banner information saved successfully...",
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
            dm.runDataQuery(`UPDATE banner_master SET ${setData} LASTUPDATED = ? where ID = ?;`, recordData, req, (error, results) => {
                if (error) {
                    console.error(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to update Banner information."
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Banner information updated successfully...",
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


exports.remove = (req, res) => {
    var ID = req.body.ID
    var URL = req.body.URL
    var systemDate = bm.getSystemDate();
    try {
        dm.runDataQuery(`UPDATE banner_master SET STATUS = 0 ,LASTUPDATED = ? where ID = ?;`, [systemDate, ID], req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to update Banner information."
                });
            } else {
                var fileUrl = path.join(__dirname, '../../Uploads/Banners/' + URL)
                fs.unlink(fileUrl, (err) => {
                    if (err) {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "fail to delete file."
                        })
                    }
                    else {
                        res.send({
                            "code": 200,
                            "message": "file delete successful."
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