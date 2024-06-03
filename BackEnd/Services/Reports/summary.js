const dm = require('../../Modules/dbModule');
const bm = require('../../Modules/basicModules');
const { logError } = require('../../Modules/logger');


exports.getDashboardCount = (req, res) => {

    try {
        dm.runQuery('SELECT COUNT(IF(CASE_TYPE=1,1,null))AS CASES,COUNT(IF(CASE_TYPE=2,1,null))AS AI,COUNT(IF(CASE_TYPE=3,1,null))AS VACCINATIONS from patient_master ; SELECT  COUNT(ID) AS MEMBERS from member_master WHERE IS_ACTIVE = 1 ', req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get count.",
                });
            }
            else {
                res.send({
                    "code": 200,
                    "message": "success",
                    "data": {
                        CASES: results[0][0].CASES,
                        AI: results[0][0].AI,
                        VACCINATIONS: results[0][0].VACCINATIONS,
                        MEMBERS: results[1][0].MEMBERS
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

exports.getMemberWiseCount = (req, res) => {
    let filter = req.body.filter ? req.body.filter : '';
    try {
        dm.runQuery('SELECT COUNT(CASE WHEN IS_CLOSED = 1 THEN 1 END) AS CLOSED,COUNT(CASE WHEN IS_CLOSED = 0 THEN 1 END) AS ACTIVE FROM patient_master WHERE 1 ' + filter, req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get count.",
                });
            }
            else {
                res.send({
                    "code": 200,
                    "message": "success",
                    "data": results[0]
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

exports.getTypeWiseCount = (req, res) => {
    let filter = req.body.filter ? req.body.filter : '';
    try {
        dm.runQuery('SELECT CASE_TYPE,IFNULL(COUNT(CASE WHEN IS_CLOSED = 1 THEN 1 END),0) AS CLOSED,IFNULL(COUNT(CASE WHEN IS_CLOSED = 0 THEN 1 END),0) AS ACTIVE FROM patient_master WHERE 1 ' + filter, req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get count.",
                });
            }
            else {
                let a = [
                    { CASE_TYPE: 1, CLOSED: 0, ACTIVE: 0 },
                    { CASE_TYPE: 2, CLOSED: 0, ACTIVE: 0 },
                    { CASE_TYPE: 3, CLOSED: 0, ACTIVE: 0 }
                ]
                const mergeObjects = (a, results) => ({
                    CASE_TYPE: a.CASE_TYPE,
                    CLOSED: results ? results.CLOSED : a.CLOSED,
                    ACTIVE: results ? results.ACTIVE : a.ACTIVE
                });
                let c = a.map(objA => {
                    let matchingB = results.find(objB => objB.CASE_TYPE === objA.CASE_TYPE);
                    return mergeObjects(objA, matchingB);
                });
                res.send({
                    "code": 200,
                    "message": "success",
                    "data": c
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
