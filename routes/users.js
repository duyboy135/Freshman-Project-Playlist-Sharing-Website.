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
router.use(require('./../session.js'));
/*END OF DEPENDENCY*/
var options = {
    url: '',
    headers: require('./../API/OAuth.js').headers
};


router.post('/add', function(req, res, next){
  if(req.session.username == null)
  	res.redirect('/authentication_fail');
  var user_id = req.body.user_id;
  var playlist_id = req.body.playlist_id;
  var username = req.session.username;
  options.url = format('https://api.spotify.com/v1/users/{}/playlists/{}?fields=name',user_id, playlist_id);
  request(options, function(err, _res, body) {  
  var data = JSON.parse(body);
	console.log(data);
	if (typeof data.error === "undefined")
	  	con.query(format("SELECT * from all_playlist WHERE playlist_id = '{}'", playlist_id), function(err, rows, fields){
	  		if (rows.length > 0){
	  			res.redirect('/duplicate');
	  		}
	 		else
		  		con.query(format("INSERT INTO all_playlist (playlist_id, user_id, number_likes, username) VALUES ( '{}' , '{}' , {}, '{}' )", playlist_id, user_id, '0', username), function(err, rows, fields){
		          	if(err){
		          		console.log('failure');  
		            	res.redirect('/failure');
		          	}
		          	else{
		            	console.log('sucess');    		
		            	res.redirect('/success');
		        	}
		        });
	  	});
    else{
    	console.log('failure');   
    	res.redirect('/failure');
    }

	});
}); 

module.exports = router
