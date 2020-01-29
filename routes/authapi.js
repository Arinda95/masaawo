var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var AddPlate = mongoose.model('PlateSubmission');
var ApprPlate = mongoose.model('Plate');
var ReportPlate = mongoose.model('Report');
var Contact = mongoose.model('Contact');
var QuerriedPlate = mongoose.model('PlateQuery');
var Users = mongoose.model('User');

//This is the admins api
//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()){
        var data = req.user;
        var proc = JSON.stringify(data);
        var tier = proc.split('"tier":').pop().split(',').shift();
        if (tier == 1){
            return next();
        }
        else{
            return res.json('E001');
        }
    }
    else{
        // if the user is not authenticated then redirect him to the login page
        return res.json('E100');
    }
};


router.get('/plates', isAuthenticated, function(req, res){
    AddPlate.find(function(err, data){
        if(err){
            return res.send(500, err);
        }
        return res.send(data);
    });
})

router.get('/apprplates', isAuthenticated, function(req, res){
    ApprPlate.find(function(err, data){
        if(err){
            return res.send(500, err);
        }
        return res.send(data);
    });
})

//Add a specific number to the official list
router.post('/plates', isAuthenticated, function(req, res){
    var plate = new ApprPlate();
    plate.numberPlate = req.body.numberPlate;
    plate.location = req.body.location;
    plate.additionalInfo = req.body.additionalInfo;
    plate.approved = 1;
    plate.save(function(err, plate){
        if(err){
            return res.send(500, err);
        }
        return res.json(plate);
    });
})


router.get('/plates/:id', isAuthenticated, function(req, res){
    ApprPlate.findById(req.params.id, function(err, plate){
        if(err)
            res.send(err);
        res.json(plate);
    });
})


//Update the approval
router.put('/plates/:id', isAuthenticated, function(req, res){
    ApprPlate.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, plate){
        if(err)
            return res.status(500).send("E200");
        res.status(200).send(plate);
    });
});

router.get('/users', isAuthenticated, function(req, res){
    Users.find(function(err, data){
        if(err){
            return res.send(500, err);
        }
        return res.send(data);
    });
})

//User updates
router.put('/users/:id', isAuthenticated, function(req, res){
    Users.findByIdAndUpdate(req.params.id, req.body, {new: true},
    function(err, plate){
        if(err)
            return res.status(500).send("E200");
        res.status(200).send(plate);
    });
});

router.get('/users/:id', isAuthenticated, function(req, res){
    Users.findById(req.params.id, function(err, post){
        if(err)
            res.send(err);
        res.json(post);
    });
})
//Blocking users
router.put('/users/:id', isAuthenticated, function(req, res){
    Users.findByIdAndUpdate(req.params.id, req.body, {new: true},
        function(err, user){
            if(err)
                return res.status(500).send("E200");
            res.status(200).send(user);
        });
    });

//returns all numberplates listed
router.get('/platereport', isAuthenticated, function(req, res){
    ReportPlate.find(function(err, data){
        if(err){
            return res.send(500, err);
        }
        return res.send(data);
    });
})

//returns specific plate number according to id
router.get('/platereport/:id', isAuthenticated, function(req, res){
    ReportPlate.findById(req.params.id, function(err, post){
        if(err)
        res.send(err);
        res.json(post);
    });
})


//This route stores messages from the people from the site contact form
router.get('/contact', isAuthenticated ,function(req, res){
    Contact.find(function(err, data){
        if(err){
            return res.send(500, err);
        }
        return res.send(data);
    });
})

//returns specific plate number according to id
router.get('/contact/:id', isAuthenticated ,function(req, res){
    Contact.findById(req.params.id, function(err, post){
        if(err)
            res.send(err);
        res.json(post);
    });
})

//returns all numberplates listed
router.get('/querriedplates', isAuthenticated ,function(req, res){
    QuerriedPlate.find(function(err, data){
        if(err){
            return res.send(500, err);
        }
        return res.send(data);
    });
})

//returns specific post according to id
router.get('/querriedplates/:id', isAuthenticated ,function(req, res){
    QuerriedPlate.findById(req.params.id, function(err, post){
        if(err)
            res.send(err);
        res.json(post);
    });
})

module.exports = router;