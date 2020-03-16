var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mysql      = require('mysql');
var dbconfig   = require('./config/dbPool.js');
var connection = mysql.createConnection(dbconfig);

var indexRouter = require('./routes/index');

var app = express();
var port = 8080;
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//html 템플릿 엔진 ejs 설정
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('SECRET'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
app.listen(port, () => {
  console.log('Express is listening on port', port);
});
module.exports = app;
