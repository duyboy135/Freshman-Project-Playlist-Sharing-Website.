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

var options = {
    url: '',
    headers: require('./../API/OAuth.js').headers
};


router.get('/info', function(req, res, next) {
  console.log('batman');
  var req_data = url.parse(req.url, true).query
  var response = '<html>'
  response += "<meta name='viewport' content='width=device-width, initial-scale=1'> <style>body {margin: 0;font-family: Arial, Helvetica, sans-serif;}.topnav { overflow: hidden; background-color: #333;}.topnav a {  float: right;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none;font-size: 17px;}.topnav a:hover {background-color: #ddd;color: black;}.topnav a.active {background-color: #4CAF50;color: white;float:left;}a.active1 {background-color: #4CAF50;color: white;}</style></head><body><div class='topnav'><a class='active' href='/'>MyMelodies</a><a class='active1' href='/users'>Add Playlist</a><a class='active1' href='/account'>Account</a></div>";
  options.url = format('https://api.spotify.com/v1/users/{}/playlists/{}?fields=tracks(items(track(artists(name),album(name),duration_ms))),name,owner(display_name)', req_data.user_id, req_data.playlist_id);
  request(options, function(err, _res, body) {  
    var data = JSON.parse(body);
    var playlist_name = data.name;
    var owner_name = data.owner.display_name;
    response += format('<h3> PLAYLIST NAME: {}</h3>',playlist_name);
    response += format('<h3> THIS PLAYLIST IS CREATED BY {}</h3>', owner_name);
    response += format('<h3> <a href="/https://open.spotify.com/user/{}/playlist/{}" class="btn-gradient red large">LINK TO THIS PLAYLIST</a> </h3>', req_data.user_id, req_data.playlist_id);
    var all_items = data.tracks.items;
    var total_time = 0; 
    var len = all_items.length;
    for(var i = 0 ; i < len ; i++)
      total_time += all_items[i].track.duration_ms;
    /*-------------*/
    total_time = Math.floor(total_time/1000);
    minutes = Math.floor(total_time/60);
    seconds = total_time - minutes*60;
    response += '<h3> THE TOTAL LENGTH OF THIS PLAYLIST IS ' + minutes.toString() + ' MINUTES AND ' + seconds.toString() + ' SECONDS' + '</h3>';
       response += '</html>';
       res.send(response);
  } );
});

module.exports = router;