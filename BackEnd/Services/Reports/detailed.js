const dm = require('../../Modules/dbModule');
const { logError } = require('../../Modules/logger');

exports.caseReport = (req, res) => {

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
                    "message": "Failed to get Patient count.",
                });
            }
            else {
                dm.runQuery(`SELECT vph.*,(SELECT JSON_ARRAYAGG( JSON_OBJECT('OBSERVATION_DATE', pdc.OBSERVATION_DATE, 'OBSERVATION_AND_FINDINGS', pdc.OBSERVATION_AND_FINDINGS, 'TREATMENT_AND_SUGGESTION', pdc.TREATMENT_AND_SUGGESTION, 'REMARKS', pdc.REMARKS ,'PRESCRIPTION', pdc.PRESCRIPTION ) ) FROM patient_daily_checkup_details pdc WHERE pdc.PATIENT_ID = vph.PATIENT_ID ) AS CHECKUP_DETAILS FROM view_patient_history vph where 1 ` + criteria, req, (error, results) => {
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

exports.aiReport = (req, res) => {

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
        dm.runQuery('select count(*) as cnt from view_ai_details where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Patient count.",
                });
            }
            else {
                dm.runQuery(`SELECT vad.*,(SELECT JSON_ARRAYAGG( JSON_OBJECT('OBSERVATION_DATE', pdc.OBSERVATION_DATE, 'OBSERVATION_AND_FINDINGS', pdc.OBSERVATION_AND_FINDINGS, 'TREATMENT_AND_SUGGESTION', pdc.TREATMENT_AND_SUGGESTION, 'REMARKS', pdc.REMARKS ,'PRESCRIPTION', pdc.PRESCRIPTION ) ) FROM patient_daily_checkup_details pdc WHERE pdc.PATIENT_ID = vad.PATIENT_ID ) AS CHECKUP_DETAILS FROM view_ai_details vad where 1 ` + criteria, req, (error, results) => {
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

exports.vaccinationReport = (req, res) => {

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
        dm.runQuery('select count(*) as cnt from view_vaccination_details where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Patient count.",
                });
            }
            else {
                dm.runQuery(`SELECT vvd.*,(SELECT JSON_ARRAYAGG( JSON_OBJECT('OBSERVATION_DATE', pdc.OBSERVATION_DATE, 'OBSERVATION_AND_FINDINGS', pdc.OBSERVATION_AND_FINDINGS, 'TREATMENT_AND_SUGGESTION', pdc.TREATMENT_AND_SUGGESTION, 'REMARKS', pdc.REMARKS ,'PRESCRIPTION', pdc.PRESCRIPTION ) ) FROM patient_daily_checkup_details pdc WHERE pdc.PATIENT_ID = vvd.PATIENT_ID ) AS CHECKUP_DETAILS FROM view_vaccination_details vvd where 1 ` + criteria, req, (error, results) => {
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

exports.caseExport = (req, res) => {

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
                    "message": "Failed to get Patient count.",
                });
            }
            else {
                dm.runQuery(`SELECT CASE_NO,REGISTRATION_DATE,DISCHARGE_DATE,DOCTOR_NAME,PROF_EDUCATION_QUALIFICATION,MEMBER_REGISTRATION_NO,IF(IS_CLOSED = 1,'YES','NO') AS IS_CLOSED,DISCHARGE_REMARK,OWNER_NAME,MOBILE_NUMBER,ADHAR_NO,ADDRESS,AT_POST,TALUKA_NAME,DISTRICT_NAME,ANIMAL_IDENTITY_NO,ANIMAL_TYPE_NAME,BREED_NAME,ANIMAL_AGE,TEMPERATURE,ABDOMINAL_MOVEMENT,PULSE,GENITAL_CONDITION,RESPIRATORY_CONDITION,OBSERVATION_OF_EYE_SKIN_NOSTRIL,WATER_INTAKE,DID_TAKE_ANTISEPTIC_DRUGS,DID_MAKE_HOME_REMEDIES,OTHER_INFORMATION,IMMUNIZATION_INFORMATION,FIRST_AID,PATIENT_SAMPLES,DIAGNOSTIC_LABORATORY_REMARK,INSTRUCTIONS_TO_OWNER ,(SELECT JSON_ARRAYAGG( JSON_OBJECT('OBSERVATION_DATE', pdc.OBSERVATION_DATE, 'OBSERVATION_AND_FINDINGS', pdc.OBSERVATION_AND_FINDINGS, 'TREATMENT_AND_SUGGESTION', pdc.TREATMENT_AND_SUGGESTION, 'REMARKS', pdc.REMARKS ,'PRESCRIPTION', pdc.PRESCRIPTION ) ) FROM patient_daily_checkup_details pdc WHERE pdc.PATIENT_ID = vph.PATIENT_ID ) AS CHECKUP_DETAILS FROM view_patient_history vph WHERE 1 ` + criteria, req, (error, results) => {
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

exports.aiExport = (req, res) => {

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
        dm.runQuery('select count(*) as cnt from view_ai_details where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Patient count.",
                });
            }
            else {
                dm.runQuery(`SELECT CASE_NO,REGISTRATION_DATE,DISCHARGE_DATE,DOCTOR_NAME,PROF_EDUCATION_QUALIFICATION,MEMBER_REGISTRATION_NO,IF(IS_CLOSED = 1,'YES','NO') AS IS_CLOSED,DISCHARGE_REMARK,OWNER_NAME,MOBILE_NUMBER,ADHAR_NO,ADDRESS,AT_POST,TALUKA_NAME,DISTRICT_NAME,ANIMAL_IDENTITY_NO,ANIMAL_TYPE_NAME,BREED_NAME,ANIMAL_AGE,DELIVERY_DATE,IF(IS_PREGNANT = 1,'YES','NO') AS IS_PREGNANT,MILK_PRODUCTION,SEMEN_TYPE,SEMEN_COMPANY_NAME,SEMEN_VOLUME,(SELECT JSON_ARRAYAGG( JSON_OBJECT('OBSERVATION_DATE', pdc.OBSERVATION_DATE, 'OBSERVATION_AND_FINDINGS', pdc.OBSERVATION_AND_FINDINGS, 'TREATMENT_AND_SUGGESTION', pdc.TREATMENT_AND_SUGGESTION, 'REMARKS', pdc.REMARKS ,'PRESCRIPTION', pdc.PRESCRIPTION ) ) FROM patient_daily_checkup_details pdc WHERE pdc.PATIENT_ID = ad.PATIENT_ID ) AS CHECKUP_DETAILS FROM view_ai_details ad WHERE 1 ` + criteria, req, (error, results) => {
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

exports.vaccinationExport = (req, res) => {

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
        dm.runQuery('select count(*) as cnt from view_vaccination_details where 1 ' + countCriteria, req, (error, results1) => {
            if (error) {
                console.error(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get Patient count.",
                });
            }
            else {
                dm.runQuery(`SELECT CASE_NO,REGISTRATION_DATE,DISCHARGE_DATE,DOCTOR_NAME,PROF_EDUCATION_QUALIFICATION,MEMBER_REGISTRATION_NO,IF(IS_CLOSED = 1,'YES','NO') AS IS_CLOSED,DISCHARGE_REMARK,OWNER_NAME,MOBILE_NUMBER,ADHAR_NO,ADDRESS,AT_POST,TALUKA_NAME,DISTRICT_NAME,ANIMAL_IDENTITY_NO,ANIMAL_TYPE_NAME,BREED_NAME,ANIMAL_AGE,TYPE,NAME,DOSE_NUMBER,SIDE_EFFECTS,(SELECT JSON_ARRAYAGG( JSON_OBJECT('OBSERVATION_DATE', pdc.OBSERVATION_DATE, 'OBSERVATION_AND_FINDINGS', pdc.OBSERVATION_AND_FINDINGS, 'TREATMENT_AND_SUGGESTION', pdc.TREATMENT_AND_SUGGESTION, 'REMARKS', pdc.REMARKS ,'PRESCRIPTION', pdc.PRESCRIPTION ) ) FROM patient_daily_checkup_details pdc WHERE pdc.PATIENT_ID = vd.PATIENT_ID ) AS CHECKUP_DETAILS FROM view_vaccination_details vd WHERE 1 ` + criteria, req, (error, results) => {
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