var express = require('express');
var router = express.Router();

var admin = require("firebase-admin");

router.post('/', function(req, res, next) {
    var referencePath = '/nurse/';
    var userReference = admin.database().ref(referencePath);
    userReference.push(req.body,
        function(error) {
            if (error) {
                res.send("Data could not be updated." + error);
            }
            else {
                res.send("Data updated successfully.");
            }
        });
});

router.get('/', function(req, res, next) {
    var referencePath = '/nurse/';
    var userReference = admin.database().ref(referencePath);
    userReference.once("value", function(data) {
        let nursesFromDB = data.val();
        let nurses = {};

        for(let nurseId in nursesFromDB) {
            let currentNurse = nursesFromDB[nurseId];
            let flag = true;

            for(let q in req.query) {
                if(req.query[q] !== currentNurse[q]) {
                    flag = false;
                }
            }

            if(flag) {
                nurses[nurseId] = currentNurse;
            }
        }


        res.send(nurses);
    }, function (errorObject) {
        res.send("The read failed: " + errorObject.code);
    });
});

router.delete('/:nurseID', function(req, res, next) {
    var referencePath = '/nurse/';
    var userReference = admin.database().ref(referencePath);
    userReference.child(req.params.nurseID).remove(function(err, result) {
        if(err) {
            res.send(false);
        } else {
            res.send(true)
        }
    });
});

router.get('/:nurseID', function(req, res, next) {
    var referencePath = '/nurse/';
    var userReference = admin.database().ref(referencePath);
    userReference.once("value", function(data) {
        let nurse = data.val()[req.params.nurseID];

        if(nurse) {
            if(req.query.only) {
                if(req.query.only === "name") {
                    res.send(nurse.name)
                } else if(false) {

                }
            } else {
                res.send(nurse)
            }

        } else {
            res.send("There is no such nurse")
        }
    }, function (errorObject) {
        res.send("The read failed: " + errorObject.code);
    });
});

module.exports = router;

