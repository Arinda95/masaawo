var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//db req
var mongoose = require('mongoose');
//db connect
mongoose.connect("mongodb://localhost/masaawodb")
require('./models/models');


var index = require('./routes/index');
var authenticate = require('./routes/authenticate')(passport);
var api = require('./routes/api');
var authapi = require('./routes/authapi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'sSDGF35rgreter%fdDFGDFGsds453'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//initialize models
require('./models/models.js');
//Initialize passport
var initPassport = require('./passport-init');
initPassport(passport);

app.use('/', index);
app.use('/api', api);
app.use('/authapi', authapi);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
