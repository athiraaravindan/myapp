var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');
var flash = require('express-flash-messages');
var jwt = require('express-jwt'); // 4565



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var validator = require('express-validator');//validation

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("connected to mongodb");
});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.baseUrl = config.baseUrl;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(flash());

// app.use(validator());//validation

app.use(cookieParser(process.env.COOKIESECRIT));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',jwt({
		secret: config.secret,//secret key
		getToken: function fromHeaderOrQuerystring (req) {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1];
		} else if (req.signedCookies && req.signedCookies.token) {
		return req.signedCookies.token;//req.signedCookies used when cookies are signed
		//if not signed ......req.cookies.name
		}
		return null;
	}
}),
 usersRouter);


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
