var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();

var cors = require('cors');


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

var app = express();


app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/academic', require('./routes/academic'));
app.use('/api/research', require('./routes/research'));
app.use('/api/project', require('./routes/project'));
app.use('/api/certification', require('./routes/certification'));
app.use('/api/skill', require('./routes/skill'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/award', require('./routes/award'));
app.use('/api/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
