var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var AddPlate = mongoose.model('PlateSubmission');
var ApprPlate = mongoose.model('Plate');
var ReportPlate = mongoose.model('Report');
var QuerriedPlate = mongoose.model('PlateQuery');
var Contact = mongoose.model('Contact');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

    //allow all get request methods
    if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
    return res.json('Not logged in!');
};

//Plate post routes
router.use('/plates', isAuthenticated)
router.route('/plates')

    .post(function(req, res){
        var plate = new AddPlate();
        var plateCap = req.body.numberplate.toUpperCase();
        plate.numberplate = plateCap;
        plate.location = req.body.location;
        plate.additionalInfo = req.body.additionalInfo;
        plate.addedby = req.body.addedby;
        plate.approved = 0;
        plate.save(function(err, plate){
            if(err){
                return res.send(500, err);
            }
            return res.json(plate);
        });
    });

router.route('/platequery')
.post(function(req, res){
    var plate = new QuerriedPlate();
    console.log(req.body);
    plate.phoneNumber = req.body.phoneNumber;
    plate.numberPlate = req.body.numberPlate;
    plate.result = req.body.result;
    plate.save(function(err, plate){
        if(err){
            return res.send(500, err);
        }
        return res.json(plate);
    });
});

//this route deals with day to day querying of license plate numbers by everyday people
//Returns the state of the numberplate
router.route('/search/:numberPlate')
    //returns specific plate according to id
    .get(function(req, res){
        //Search plate
        ApprPlate.findOne({ 'numberPlate' :  req.params.numberPlate}, function(err, plate){
            if (req.params.numberPlate == 'undefined'){
                res.json({response:{"state":"empty"}});
            }
            else{
            if(err)
                res.send(err);
            if(plate){
                if(plate.approved == 0){
                    res.json({response:{"state":"safe"}});
                }
                else if(plate.approved == 1){
                    res.json({response:{"state":"reported"}});
                }
            }
            else{
                res.json({response:{"state":"safe"}});
            }
        }
        });
    })

router.use('/falsereports', isAuthenticated)
router.route('/falsereports')
//These are reports counterclaiming reports of numbers that are already approved
    .post(function(req, res){
        var report = new ReportPlate();
        report.phonenumber = req.body.phonenumber;
        report.numberPlate = req.body.numberPlate;
        report.content = req.body.content;
        report.save(function(err, report){
            if(err){
                return res.send(500, err);
            }
            return res.json(report);
        });
    });

router.route('/contact')
//This route stores messages from the people from the site contact form
    .post(function(req, res){
        var contact = new Contact();
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.type = req.body.type;
        contact.content = req.body.content;
        contact.save(function(err, contact){
            if(err){
                return res.send(500, err);
            }
            return res.json(contact);
        });
    });


//This route was deprecated in favour of an advertising financing route.
module.exports = router;