
var express = require('express');
var session = require('express-session');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var strategy = require('./setup-passport');


var routes = require('./routes/index');
//var routes = require('./routes/features/consoleAdmCtrl');

var app = express();
app.enable('trust proxy');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({ secret: '20160101', resave: false,  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));


app.use('/', routes);

//app.use('/lti','./lti')

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('./common/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('./common/error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


//mauricionoris
//IMGwUqZg052Hiu85UQaUyNBCAZNfSQNf
//570679a74396104a534475d1

//mauricio
//IMGwUqZg052Hiu85UQaUyNBCAZNfSQNf
//56fda26103ced2933c231d3a
