var express = require('express');
var router = express.Router();
var con = require('./../database/sql.js').con;
var request = require('request');
const format = require('string-format');
/*END OF DEPENDENCY*/

var options = {
    url: '',
    headers: require('./../API/OAuth.js').headers
};


module.exports.add = function(user_id, playlist_id, next_step){
	console.log(user_id, playlist_id)
	options.url = format('https://api.spotify.com/v1/users/{}/playlists/{}?fields=name',user_id, playlist_id);
	request(options, function(err, _res, body) {  
    	var data = JSON.parse(body);
    	console.log(data);
    	if (typeof data.error === "undefined")
      		con.query(format("INSERT INTO all_playlist (playlist_id, user_id, number_likes) VALUES ( '{}' , '{}' , {} )", playlist_id, user_id, '0'), function(err, rows, fields){
	          	//console.log(format("INSERT INTO all_playlist (playlist_id, user_id, number_likes) VALUES ( '{}' , '{}' , {} )", req.body.playlist_id, req.body.user_id, '0'));
	          	if(err){
	            	return 'Error during query processing';
	            	next_step('success.html');
	          	}
	          	else{
	            	return 'SUCCESSFUL';
	        		next_step('failure.html');
	        	}
	        });
	    else{
	    	return 'INVALID COMBINATION OF PLAYLIST ID AND USER ID';
	    	next_step('failure.html');
	    }


	});
}