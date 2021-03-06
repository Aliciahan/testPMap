var express = require('express');
var path = require('path'); //pour le path du dossier /public
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
require('./models/place');
require('./models/users');
mongoose.connect('mongodb://localhost/participamap');
var db = mongoose.connection;
db.on('error', function onDBConnectionError() {
  console.error('Error: impossible to connect to MongoDB. Exiting...');
  process.exit(1);
});
db.once('open', function onDBOpen() {
  console.log('Successfully connected to MongoDB!\n');
});


//utiliser passport pour auth
var passport = require('passport');
require('./config/passport');

var routes = require('./routes/index');
var places = require('./routes/places');

var app = express();

//view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static(path.join(__dirname,'public')));

//initialisation du passport
app.use(passport.initialize());

// Routes declarations
app.use('/', routes);
app.use('/places', places);

// catch 404 and forward to error handler
app.use(function notFound(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function develErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      error: {
        code: err.status || 500,
        message: err.message,
        err: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function errorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    error: {
      code: err.status || 500,
      message: err.message,
      err: {}
    }
  });
});

module.exports = app;

/* vim: set ts=2 sw=2 et si : */
