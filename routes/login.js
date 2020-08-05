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
var playlists_manager = require('./../include/playlists_manager.js');
var con = require('./../database/sql.js').con;
var router = express.Router();
/*END OF DEPENDENCY*/
router.use(require('./../session.js'));

router.post('/login', function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	console.log(username);
	con.query(format("SELECT * FROM users WHERE username = '{}' AND password = PASSWORD('{}')", username, password), function(err, rows, field){
		console.log(rows);
		if (rows.length > 0){
			req.session.username = username;
			res.redirect('/');
		}
		else res.redirect('/login_page');

	});	
});

module.exports = router