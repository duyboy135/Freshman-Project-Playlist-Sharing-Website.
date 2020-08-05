/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var client_id = '25475482bc6e4f738816fd9aa1ac7887'; // Your client id
var client_secret = '74c5a3673f3b43a7b3b07941dc2ddaf0'; // Your secret
var redirect_uri = 'http://localhost:8888/callback';
const format = require('string-format');
 // Your redirect uri
console.log('Start');
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
app.use(require('./session.js'));
app.use(express.static(__dirname + '/@@@@'))
   .use(cookieParser());

app.get('/login', function(req, res) {
  console.log(req.session.username);
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


var con = require('./database/sql.js').con;

app.get('/callback', function(req, res) {
  console.log(req.session.username);
  var username = req.session.username;
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
      //  console.log(body)

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        console.log(access_token, refresh_token)

        var options = {
          url: 'https://api.spotify.com/v1/me/playlists',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        /*------------------------*/
        
        request.get(options, function(error, response, body) {
                for (var i = 0; i < body.items.length; i++){
                  var arr = body.items[i].uri.split(':');
                  var user_id = arr[2];
                  var playlist_id = arr[4];
                  con.query(format("INSERT IGNORE INTO all_playlist (playlist_id, user_id, number_likes, username) VALUES ( '{}' , '{}' , {}, '{}' )", playlist_id, user_id, '0', username));
                  console.log(format("INSERT IGNORE INTO all_playlist (playlist_id, user_id, number_likes, username) VALUES ( '{}' , '{}' , {}, '{}' )", playlist_id, user_id, '0', username));
                }
                

            
        //    var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional

        });
          

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});



app.listen(8888);