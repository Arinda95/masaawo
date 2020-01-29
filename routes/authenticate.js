var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//sends failure registration state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalid phonenumber and password match or You've been blocked"});
	});

	//sends failure login state back to angular
	router.get('/regfail', function(req, res){
		res.send({state: 'failure', user: null, message: "Unable to register"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/register', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/regfail'
	}));


	//log out
	router.get('/logout', function(req, res) {
		req.logout();
		res.send('EXXX');
	});

	return router;
}