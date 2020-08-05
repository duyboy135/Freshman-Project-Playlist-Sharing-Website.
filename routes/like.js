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

/*END OF DEPENDENCY*/

router.get('/like', function(req, res, next){
  var username = req.session.username;
  var req_data = url.parse(req.url, true).query;
  var playlist_id = req_data.playlist_id;
  if (req.session.username == null){
  		res.redirect('/authentication_fail')
  }
  else{
  	  con.query(format("SELECT * FROM like_management WHERE username = '{}' AND playlist_id = '{}'", username, playlist_id), function(errs, rows, field){ 	 
	  	  	console.log(rows);
	  	  	if (rows.length == 0){
	  	  	  con.query(format("INSERT INTO like_management (username, playlist_id) VALUE ( '{}' , '{}' )", username, playlist_id), function(errs, rows, fields){ 	  	   	
				  con.query(format("SELECT number_likes FROM all_playlist WHERE playlist_id = '{}'", playlist_id), function(errs, rows, fields){
				      var nlikes = rows[0]['number_likes'] + 1;
				     // console.log(nlikes);
				      con.query(format("UPDATE all_playlist SET number_likes = {} WHERE playlist_id = '{}'", nlikes.toString(), playlist_id), function(errs, rows, fields){
				          res.redirect('/');
				      });

				  });
			   });
			}
			else{
				res.redirect('/mutiple_like');
			}
		});
  	}
});

module.exports = router;