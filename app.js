var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url')
var request = require('request');
const format = require('string-format');
var session = require('client-sessions');
var querystring = require('querystring');
var playlists_manager = require('./include/playlists_manager.js');
//var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();
var fs = require('fs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
  cookieName: 'session',
  secret: 'sadasdasdasd',
  duration: 30*60*1000,
  activeDuration: 5*60*1000
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Database create//
/*
var mysql = require('mysql')
var con = mysql.createConnection({
  host: 'twilbury.cs.drexel.edu',
  user: 'dj458',
  password: 'oiskfulao',
  database: 'dj458_info152_201702'
});
*/

var con = require('./database/sql.js').con;


/*ROUTER*/

var index = require('./routes/index.js');
app.use('/', index);
var users = require('./routes/users.js');
app.use('/', users);
var login = require('./routes/login.js');
app.use('/', login);
var likes = require('./routes/like.js');
app.use('/', likes);
var account = require('./routes/account.js');
app.use('/', account);
var info = require('./routes/get_info.js');
app.use('/', info);
var register = require('./routes/register.js');
app.use('/', register);
app.get('/success', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/views/success.html'));
});

app.get('/failure', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/views/failure.html'));
});
app.get('/duplicate', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/views/duplicate.html'));
});
app.get('/login_page', function(req, res ,next){
  res.sendFile(path.join(__dirname + '/views/login.html'));
});
app.get('/authentication_fail', function(req, res ,next){
  res.sendFile(path.join(__dirname + '/views/authentication_fail.html'));
});
app.get('/mutiple_like', function(req, res, next){
  res.sendFile(path.join(__dirname + '/views/mutiple_like.html'));
});
app.get('/logout',function(req,res,next){
  req.session.username = null;
  res.redirect('/');
});

app.get('/register_page', function(req, res,next){
  if(req.session.username == null)
      res.sendFile(path.join(__dirname + '/views/register_page.html'));
  else 
      res.redirect('/');
});
app.get('/users', function(req, res, next) {
  if (req.session.username == null)
    res.redirect('/authentication_fail');
  res.sendFile(path.join(__dirname + '/views/form.html'));
});



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
