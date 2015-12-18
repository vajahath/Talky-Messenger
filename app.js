// Auth: Vajahath Ahmed
// Date: 12/18/2015
// File: app.js

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({secret:'I am in a relationship with someone.'}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//app.get('/', function(req, res)
//{
//    console.log("in /");
//    req.session.destroy(function(err)
//    {
//        if(err)
//        {
//            console.log("session NOT cleared...!*************************** err:", err);
//            res.redirect('/me'); //something went wrong!
//        }
//        else
//        {
//            console.log("session cleared...! no err, sign up");
//
//            res.render('./who.ejs', {
//                "title":"so u r here!"
//            });
//        }
//    });
//});


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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

// Vajahath Ahmeed
// vajuoff.1@gmail.com
// google.com/+VajahathAhmedAwesome
