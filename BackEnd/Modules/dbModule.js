const pool = require('../Config/dbConfig')
const { promisify } = require('util');
const { logError, logInfo } = require('./logger');

exports.runDataQuery = (query, data, req, callback) => {
    console.log(query, data);
    pool.query(query, data, (error, results) => {
        callback(error, results);
        if (error) {
            logError(req.method, req.originalUrl, error.sqlMessage, query, data, "QueryData");
        }
        // else {
        //     logInfo(req.method, req.originalUrl, query, data, "QueryData");
        // }
    });
};

exports.runQuery = (query, req, callback) => {
    console.log(query);
    pool.query(query, (error, results) => {
        callback(error, results);
        if (error) {
            logError(req.method, req.originalUrl, error.sqlMessage, query, "", "Query");
        }
        // else {
        //     logInfo(req.method, req.originalUrl, query, "", "Query");
        // }
    });
};

exports.runDMLQuery = (query, data, connection, req, callback) => {
    console.log(query, data);
    connection.query(query, data, (error, results) => {
        callback(error, results);
        if (error) {
            logError(req.method, req.originalUrl, error.sqlMessage, query, data, "QueryData");
        }
        // else {
        //     logInfo(req.method, req.originalUrl, query, data, "QueryData");
        // }
    });
}

exports.rollback = (connection) => {
    try {
        connection.rollback(() => {
            connection.release();
        });
    } catch (error) {
        console.error("Error rolling back transaction:", error);
    }
};

exports.commit = (connection) => {
    try {
        connection.commit(() => {
            connection.release();
        });
    } catch (error) {
        console.error("Error committing transaction:", error);
    }
};

exports.getConnection = async () => {
    try {
        const connection = await promisify(pool.getConnection).bind(pool)();
        const beginTransactionAsync = promisify(connection.beginTransaction.bind(connection));
        await beginTransactionAsync();
        console.log("Connection acquired.");
        return connection;
    } catch (error) {
        console.error("Exception in getConnection: ", error);
        throw error;
    }
};

