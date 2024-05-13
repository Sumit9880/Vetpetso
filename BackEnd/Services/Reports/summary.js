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
        dm.runQuery('SELECT COUNT(CASE WHEN DISCHARGE_DATE IS NOT NULL THEN 1 END) AS CLOSED,COUNT(CASE WHEN DISCHARGE_DATE IS NULL THEN 1 END) AS ACTIVE FROM patient_master WHERE 1 ' + filter, req, (error, results) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get count.",
                });
            }
            else {
                console.log(results);
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