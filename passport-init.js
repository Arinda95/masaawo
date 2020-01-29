var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt');

module.exports = function(passport){
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.phonenumber);
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user:',user.phonenumber);
			done(err, user);
		});
	});


	//Passport localStrategy extended to include elements unique to KifeesiTaxiApp
	passport.use('login', new LocalStrategy({
		usernameField: 'phonenumber',
		passwordField: 'password',
		passReqToCallback : true
		},
		function(req, phonenumber, password, done) {

			// check in mongo if a user with phonenumber exists or not
			User.findOne({ 'phonenumber' :  phonenumber },
				function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Phonenumber does not exist, log the error and redirect back
					if (!user){
						return done(null, false);
					}
					// User exists but wrong password, log the error
					if (!isValidPassword(user, password)){
						return done(null, false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
					if (user.blocked == 1){
						return done(null, false);
					}
					if (user.blocked == 0){
						return done(null, user);
					}
				}
			);
		}
	));

	passport.use('signup', new LocalStrategy({
		usernameField: 'phonenumber',
		passwordField: 'password',
		passReqToCallback : true
		},
		function(req, phonenumber, password, done) {

			// find a user in mongo with provided phonenumber
			User.findOne({ 'phonenumber' :  phonenumber}, function(err, user) {
				// In case of any error, return using the done method
				if (err){
					console.log('Error registering: '+err);
					return done(err);
				}
				// already exists
				if (user) {
					console.log('Phone number already in use: '+phonenumber);
					return done(null, false);
				} else {
					// if there is no user, create the user
					var newUser = new User();
					// set the user's local credentials
					newUser.phonenumber = phonenumber;
					newUser.password = createHash(password);
					//Users access level
					newUser.tier = 3;
					//User is not blocked from the service
					newUser.blocked = 0;

					// save the user
					newUser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);
							throw err;
						}
						console.log(newUser.phonenumber + ' Registration succesful');
						return done(null, newUser);
					});
				}
			});
		})
	);

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
};
