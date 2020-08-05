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
var router = express.Router();
var con = require('./../database/sql.js').con;
router.use(require('./../session.js'));

function display_data(user_name){
	var response = "";
	response += " <meta name='viewport' content='width=device-width, initial-scale=1'> <style>body {margin: 0;font-family: Arial, Helvetica, sans-serif;}.topnav { overflow: hidden; background-color: #333;}.topnav a {  float: right;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none;font-size: 17px;}.topnav a:hover {background-color: #ddd;color: black;}.topnav a.active {background-color: #4CAF50;color: white;float:left;}a.active1 {background-color: #4CAF50;color: white;}</style></head><body><div class='topnav'><a class='active' href='/'>MyMelodies</a><a class='active1' href='/users'>Add Playlist</a><a class='active1' href='/account'>Account</a></div>";
	response += format("<h2> USERNAME: {}", user_name);
	response += '<br> </br><a href="/logout" class="btn-gradient red large">Sign Out</a>';
	response += '<br> </br><a href="http://localhost:8888" class="btn-gradient red large">Link to Spotify Account</a>';
	response += '</html>';
	return response;
}

/*END OF DEPENDENCY*/
router.get('/account', function(req,res,next){
	if (req.session.username == null)
		res.redirect('/login_page');
	else {
		res.send(display_data(req.session.username));
	}
});

module.exports = router;