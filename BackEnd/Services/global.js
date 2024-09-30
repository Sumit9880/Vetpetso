const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const dm = require('../Modules/dbModule');
const { logError } = require('../Modules/logger');

exports.checkAuthorization = (req, res, next) => {
    try {
        var apikey = req.headers['apikey'];
        if (apikey == process.env.APIKEY) {
            next();
        }
        else {
            res.send({
                "code": 300,
                "message": "Access Denied...!"
            });
        }
    } catch (error) {
        console.error(error)
        res.send({
            "code": 400,
            "message": "Server not found..."
        });
    }
}

exports.checkToken = (req, res, next) => {
    let bearerHeader = req.headers['token'];
    if (typeof bearerHeader !== 'undefined') {
        jwt.verify(bearerHeader, process.env.SECRET, (err, decode) => {
            if (err) {
                res.send({
                    'code': 400,
                    'message': 'Invalid token'
                });
            }
            else {
                next();
            }
        });
    }
    else {
        res.send({
            'code': 400,
            'message': 'Access Denied...!'
        });
    }
}

exports.events = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/Events/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.banners = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/Banners/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.memberSign = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/MemberSign/') + fields.Name;
                var ID = fields.ID[0]
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        if (ID !== null && ID !== '' && ID !== undefined && ID > 0) {
                            dm.runDataQuery('select MEMBER_SIGN from member_master where ID = ? ', [ID], req, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Member information.",
                                    });
                                }
                                else {
                                    dm.runDataQuery('update member_master set  MEMBER_SIGN = ? where ID = ? ', [fields.Name[0], ID], req, (error, results) => {
                                        if (error) {
                                            console.error(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Member information."
                                            });
                                        }
                                        else {
                                            if (results && results[0]?.MEMBER_SIGN) {
                                                const imagepath = path.join(__dirname, '../Uploads/MemberSign/', results[0].MEMBER_SIGN);
                                                if (fs.existsSync(imagepath)) {
                                                    fs.unlinkSync(imagepath);
                                                }
                                            }
                                            res.send({
                                                "code": 200,
                                                "message": "success",
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                            });
                        }
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        logError(req.method, req.originalUrl, err, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.experienceLetter = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/ExperienceLetter/') + fields.Name;
                var ID = fields.ID[0]
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        if (ID !== null && ID !== '' && ID !== undefined && ID > 0) {
                            dm.runDataQuery('select EXPERIENCE_LETTER from member_master where ID = ? ', [ID], req, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Member information.",
                                    });
                                }
                                else {
                                    dm.runDataQuery('update member_master set EXPERIENCE_LETTER = ? where ID = ? ', [fields.Name[0], ID], req, (error, results1) => {
                                        if (error) {
                                            console.error(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Member information."
                                            });
                                        }
                                        else {
                                            if (results && results[0]?.EXPERIENCE_LETTER) {
                                                const imagepath = path.join(__dirname, '../Uploads/ExperienceLetter/', results[0].EXPERIENCE_LETTER);
                                                if (fs.existsSync(imagepath)) {
                                                    fs.unlinkSync(imagepath);
                                                }
                                            }
                                            res.send({
                                                "code": 200,
                                                "message": "success",
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                            });
                        }
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        logError(req.method, req.originalUrl, err, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.leavingCretificate = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/LeavingCretificate/') + fields.Name;
                var ID = fields.ID[0]
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        if (ID !== null && ID !== '' && ID !== undefined && ID > 0) {
                            dm.runDataQuery('select LEAVING_CERTIFICATE from member_master where ID = ? ', [ID], req, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Member information.",
                                    });
                                }
                                else {
                                    dm.runDataQuery('update member_master set LEAVING_CERTIFICATE = ? where ID = ? ', [fields.Name[0], ID], req, (error, results1) => {
                                        if (error) {
                                            console.error(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Member information."
                                            });
                                        }
                                        else {
                                            if (results && results[0]?.LEAVING_CERTIFICATE) {
                                                const imagepath = path.join(__dirname, '../Uploads/LeavingCretificate/', results[0].LEAVING_CERTIFICATE);
                                                if (fs.existsSync(imagepath)) {
                                                    fs.unlinkSync(imagepath);
                                                }
                                            }
                                            res.send({
                                                "code": 200,
                                                "message": "success",
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                            });
                        }
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        logError(req.method, req.originalUrl, err, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.educationalCretificate = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/EducationalCretificate/') + fields.Name;
                var ID = fields.ID[0]
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        if (ID !== null && ID !== '' && ID !== undefined && ID > 0) {
                            dm.runDataQuery('select EDUCATIONAL_CERTIFICATE from member_master where ID = ? ', [ID], req, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Member information.",
                                    });
                                }
                                else {
                                    dm.runDataQuery('update member_master set EDUCATIONAL_CERTIFICATE = ? where ID = ? ', [fields.Name[0], ID], req, (error, results1) => {
                                        if (error) {
                                            console.error(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Member information."
                                            });
                                        }
                                        else {
                                            if (results && results[0]?.EDUCATIONAL_CRETIFICATE) {
                                                const imagepath = path.join(__dirname, '../Uploads/EducationalCretificate/', results[0].EDUCATIONAL_CRETIFICATE);
                                                if (fs.existsSync(imagepath)) {
                                                    fs.unlinkSync(imagepath);
                                                }
                                            }
                                            res.send({
                                                "code": 200,
                                                "message": "success",
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                            });
                        }
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        logError(req.method, req.originalUrl, err, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.profilePhoto = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/ProfilePhoto/') + fields.Name;
                var ID = fields.ID[0]
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        if (ID !== null && ID !== '' && ID !== undefined && ID > 0) {
                            dm.runDataQuery('select PROFILE_PHOTO from member_master where ID = ? ', [ID], req, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Member information.",
                                    });
                                }
                                else {
                                    dm.runDataQuery('update member_master set PROFILE_PHOTO = ? where ID = ? ', [fields.Name[0], ID], req, (error, results1) => {
                                        if (error) {
                                            console.error(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Member information."
                                            });
                                        }
                                        else {
                                            if (results && results[0]?.PROFILE_PHOTO) {
                                                const imagepath = path.join(__dirname, '../Uploads/ProfilePhoto/', results[0].PROFILE_PHOTO);
                                                if (fs.existsSync(imagepath)) {
                                                    fs.unlinkSync(imagepath);
                                                }
                                            }
                                            res.send({
                                                "code": 200,
                                                "message": "success",
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                            });
                        }
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        logError(req.method, req.originalUrl, err, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.adharCard = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/AdharCard/') + fields.Name;
                var ID = fields.ID[0]
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        if (ID !== null && ID !== '' && ID !== undefined && ID > 0) {
                            dm.runDataQuery('select ADHAR_CARD from member_master where ID = ? ', [ID], req, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Member information.",
                                    });
                                }
                                else {
                                    dm.runDataQuery('update member_master set ADHAR_CARD = ? where ID = ? ', [fields.Name[0], ID], req, (error, results1) => {
                                        if (error) {
                                            console.error(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Member information."
                                            });
                                        }
                                        else {
                                            if (results && results[0]?.ADHAR_CARD) {
                                                const adharCardPath = path.join(__dirname, '../Uploads/AdharCard/', results[0].ADHAR_CARD);
                                                if (fs.existsSync(adharCardPath)) {
                                                    fs.unlinkSync(adharCardPath);
                                                }
                                            }
                                            res.send({
                                                "code": 200,
                                                "message": "success",
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                            });
                        }
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        logError(req.method, req.originalUrl, err, '', '', "CatchError");
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.panCard = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/PanCard/') + fields.Name;
                var ID = fields.ID[0]
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        if (ID !== null && ID !== '' && ID !== undefined && ID > 0) {
                            dm.runDataQuery('select PAN_CARD from member_master where ID = ? ', [ID], req, (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.send({
                                        "code": 400,
                                        "message": "Failed to get Member information.",
                                    });
                                }
                                else {
                                    dm.runDataQuery('update member_master set PAN_CARD = ? where ID = ? ', [fields.Name[0], ID], req, (error, results1) => {
                                        if (error) {
                                            console.error(error);
                                            res.send({
                                                "code": 400,
                                                "message": "Failed to update Member information."
                                            });
                                        }
                                        else {
                                            if (results && results[0]?.PAN_CARD) {
                                                const imagepath = path.join(__dirname, '../Uploads/PanCard/', results[0].PAN_CARD);
                                                if (fs.existsSync(imagepath)) {
                                                    fs.unlinkSync(imagepath);
                                                }
                                            }
                                            res.send({
                                                "code": 200,
                                                "message": "success",
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                            });
                        }
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        logError(req.method, req.originalUrl, err, '', '', "CatchError");
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.ownerSign = function (req, res) {
    try {
        const form = new formidable.IncomingForm({
            allowEmptyFiles: true,
        });
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/OwnerSign/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.patientImage = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/PatientImage/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.animalType = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/AnimalType/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.notice = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/Notice/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.commitee = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/Commitee/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.gallery = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/Gallery/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.history = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/History/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.planImage = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/PlanImage/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}

exports.labReports = function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                res.send({
                    "code": 400,
                    "message": "failed to upload.."
                });
            } else {
                var oldPath = files.Image[0].filepath;
                var newPath = path.join(__dirname, '../Uploads/LabReports/') + fields.Name;
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, function (err) {
                    if (!err) {
                        res.send({
                            "code": 200,
                            "message": "success",
                        });
                    }
                    else {
                        console.error(err);
                        res.send({
                            "code": 400,
                            "message": "failed to upload.."
                        });
                    }
                })
            }
        })
    }
    catch (err) {
        console.error(err);
        res.send({
            "code": 500,
            "message": "Network error..."
        });
    }
}