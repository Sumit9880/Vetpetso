const { logError } = require('../Modules/logger')
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.getSystemDate = function () {
    let date_ob = new Date();

    // current date 
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + date_ob.getHours()).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    date_cur = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return date_cur;
}

exports.generateToken = function (userId, res, resultsUser) {
    try {
        var data = {
            "USER_ID": userId,
        }
        jwt.sign({ data }, process.env.SECRET, (error, token) => {
            if (error) {
                console.error(error);
                logError(req.method, req.originalUrl, error, '', '', "JWTTokenError");
                res.send({
                    "code": 500,
                    "message": "Something went wrong."
                });
            }
            else {
                res.send({
                    "code": 200,
                    "message": "Logged in successfully.",
                    "data": [{
                        "token": token,
                        "UserId": userId,
                        "isLoggedIn": true
                    }
                    ]
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

exports.sendOtp = async function (msg, to, callback) {
    try {
        const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`;

        const data = {
            messaging_product: "whatsapp",
            to: "91" + to,
            text: {
                body: msg
            }
        };

        const headers = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const response = await axios.post(url, data, headers);
        console.log(url, data, headers);

        if (response.status === 200) {
            callback(null, response.data);
        } else {
            callback(new Error('Failed to send message'), null);
        }

    } catch (error) {
        console.error("Error sending message:", error);
        callback(error, null);
    }
};


