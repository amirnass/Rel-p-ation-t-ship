var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

router.post('/', function(req, res, next) {
  var referencePath = '/patience/';
  var userReference = admin.database().ref(referencePath);
  userReference.push(req.body,
      function(error) {
        if (error) {
          res.send("Data could not be save." + error);
        }
        else {
          res.send("Data saved successfully.");
        }
      });
});

router.put('/:patienceID', function(req, res, next) {
    var referencePath = '/patience/';
    var userReference = admin.database().ref(referencePath);
    userReference.child(req.params.patienceID).update(req.body,
        function(error) {
            if (error) {
                res.send("Data could not be updated." + error);
            }
            else {
                res.send("Data updated successfully.");
            }
        });
});

router.delete('/:patienceID', function(req, res, next) {
    var referencePath = '/patience/';
    var userReference = admin.database().ref(referencePath);
    userReference.child(req.params.patienceID.fullName).remove(function(err, result) {
        if(err) {
            res.send(false);
        } else {
            res.send(true)
        }
    });
});

//get all patients with spesific field
router.get('/', function(req, res, next) {
    var referencePath = '/patience/';
    var userReference = admin.database().ref(referencePath);
    userReference.once("value", function(data) {

        let patientsFromDB = data.val();
        let patients = {};

        for(let patientId in patientsFromDB) {
            let currentpatient = patientsFromDB[patientId];
            let flag = true;

            for(let q in req.query) {
                if(req.query[q] !== currentpatient[q]) {
                    flag = false;
                }
            }

            if(flag) {
                patients[patientId] = currentpatient;
            }
        }

        res.send(patients);
    }, function (errorObject) {
        res.send("The read failed: " + errorObject.code);
    });
});


// Get patient by ID.
router.get('/:patienceID', function(req, res, next) {
    var referencePath = '/patience/';
    var userReference = admin.database().ref(referencePath);
    userReference.once("value", function(data) {
        let patient = data.val()[req.params.patienceID];

        if(patient) {
            if(req.query.only) {
                if(req.query.only === "name") {
                    res.send(patient["full name"])
                } else if(req.query.only === "id") {
                    res.send(patient["id"])
                } else if(req.query.only === "department") {
                    res.send(patient["department"])
                } else if(req.query.only === "respo_nurse") {
                    res.send(patient["respo_nurse"])
                } else if(req.query.only === "status") {
                    res.send(patient["status"])
                } else{
                    res.send(patient["full name"])
                }
            } else {
                res.send(patient)
            }
        } else {
            res.send("There is no such patient")
        }
    }, function (errorObject) {
        res.send("The read failed: " + errorObject.code);
    });
});

module.exports = router;


