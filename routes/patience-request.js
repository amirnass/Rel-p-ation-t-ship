var express = require('express');
var router = express.Router();

var admin = require("firebase-admin");

router.post('/', function (req, res, next) {
    req.body["status"] = "unhandled";

    var referencePath = '/patience-request/';
    var userReference = admin.database().ref(referencePath);
    userReference.push(req.body,
        function (error) {
            if (error) {
                res.send("Data could not be updated." + error);
            } else {
                res.send("Data updated successfully.");
            }
        });
});

//getting all petients for spesific filed.
router.get('/', function (req, res, next) {
    var referencePath = '/patience-request/';
    var userReference = admin.database().ref(referencePath);
    userReference.once("value", function (data) {

        let result = {};
        let requests = data.val();

        for (let requestId in requests) {
            let request = requests[requestId];
            let isRelevant = true;

            for (let q in req.query) {
                if (q !== 'sort' && request[q] !== req.query[q]) {
                    isRelevant = false;
                }
            }

            if (isRelevant) {
                result[requestId] = request;
            }

        }
        requests = result;
        let x = [];
        if (req.query.sort) {
            let myStorted = Object.keys(requests).sort(function (requestA, requestB) {
                    let res = Number(requests[requestA].severe) - Number(requests[requestB].severe);
                    return req.query.sort === 'ASC' ? res : -1 * res;
                })

            myStorted.forEach(function (id) {
                x.push(requests[id]);
                // result[id] = requests[id];
            })
        }

        res.send(req.query.sort ? x : requests);
    }, function (errorObject) {
        res.send("The read failed: " + errorObject.code);
    });
});

//specific request id with spesific filed.
router.get('/:patienceRequestID', function (req, res, next) {
    var referencePath = '/patience-request/';
    var userReference = admin.database().ref(referencePath);
    userReference.once("value", function (data) {
        let requests = data.val();
        let result = {}

        for (let requestId in requests) {
            let request = requests[requestId];
            let isRelevant = true;

            for (let q in req.query) {
                if ( q !== 'only' && request[q] !== req.query[q]) {
                    isRelevant = false;
                }
            }
            if (isRelevant) {
                result[requestId] = request;
            }
        }
        let patientRequest = result[req.params.patienceRequestID];

        if (patientRequest) {
            if (req.query.only) {
                res.send(patientRequest[req.query.only])
            } else {
                res.send(patientRequest)
            }
        } else {
            res.send("There is no such patient")
        }
    }, function (errorObject) {
        res.send("The read failed: " + errorObject.code);
    });
});


module.exports = router;
