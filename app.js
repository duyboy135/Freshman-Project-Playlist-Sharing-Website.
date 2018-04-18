var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var level = require('level')
var url = require('url')
var request = require('request');
//var index = require('./routes/index');
//var users = require('./routes/users');

var db = level('./mydb')
var app = express();
var fs = require('fs');
var user_id = ["shelby.juhasz", "eo1vnjc69ocrkarwna4azf1xy"];
var playlist_id = ["3jjUWnJzVHqJgVNTFRTwV4", "2dgB4Q51GNkX9gKjzHB7Zi"];
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);

var option = 'width="350" height="280" frameborder="0" allowtransparency="true" allow="encrypted-media"> </iframe>';
var cell_option = '<td align = "center" width = "350px" height = "150px">';
var cell_option_first_line = '<td align = "center" width = "350px" height = "50px">';
function getLink(_user_id, _playlist_id){
	return '<iframe src="https://open.spotify.com/embed?uri=spotify:user:' + _user_id + ':playlist:' + _playlist_id + '" ' + option;
}

app.get('/', function(req, res, next) {
	//res.render('index', { title: 'Spotify Playlist Viewer' });
  var response = '<html>';
  response += '<h1> WELCOME TO TEAM 22 CI-PROTOTYPE </h1>';
  response += '<h2> YOU CAN ADD NEW SPOTIFY PLAYLIST BY CLICKING TO THIS LINK <a href="/users">ADD NEW PLAYLIST</a> </h2>';
  response += '<h2> HERE IS THE PLAYLIST TABLE </h2>';
  response +=  '<br></br> <table border = "1" align = "left">';
 	response += '<tr>' + cell_option_first_line + '<font size="4"> ID  </font></td>' + cell_option_first_line +  '<font size="4"> PLAYLIST </font></td>';
  response += cell_option_first_line + '<font size="4"> PLAYLIST_INFORMATION </font></td> </tr>' 
  len = user_id.length;
  for(var i = 0; i < len ; i++){ 
  	response += '<tr>';
  	response += (cell_option + '<font size="5"> #' + (i + 1).toString() + '</font></td>');
  	response += (cell_option +  getLink(user_id[i], playlist_id[i])  + '</td>');
    response += (cell_option + '<a href = "/info?user_id='  + user_id[i] + '&playlist_id=' + playlist_id[i]) + '"> <font size="3"> CLICK HERE FOR MORE INFORMATION OF THIS PLAYLIST </font></td>' ;
  	response += '</tr>';
  }		
  response += '</table>';
  response += '</html>';
  res.send(response);

});

/*---------------------------------------------------------------------------------------------------------------*/
headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer BQDBy4m_cVXnGXkI7mAi0Dv5OMDfwP0nQcYWbRIYrp9tKiYUxAZigf_WSLH2nRax33U5Q2WaX6mUAk1wyahYlPIRfXStByrbpP0Ir8BLmTAPp19wKzvjedynF-dXA7vUqH5lVUDKQ0MPLW-4RzYp3du5o9Hw8PhMVQ',
}

var options = {
    url: '',
    headers: headers
};

app.get('/info', function(req, res, next) {
  var req_data = url.parse(req.url, true).query
  var response = '<html>'
  options.url = 'https://api.spotify.com/v1/users/' + req_data.user_id + '/playlists/' + req_data.playlist_id + '?fields=tracks(items(track(artists(name),album(name),duration_ms))),name,owner(display_name)';
  request(options, function(err, _res, body) {  
    var data = JSON.parse(body);
    console.log(data);
    var playlist_name = data.name;
    var owner_name = data.owner.display_name;
    response += '<h3> PLAYLIST NAME: ' + playlist_name + '</h3>';
    response += '<h3> This playlis is created by ' + owner_name + '</h3>';
    console.log('good');
    var all_items = data.tracks.items;
    console.log(data.tracks);

    /*Cal total time**/
    var total_time = 0;
    var len = all_items.length;
    for(var i = 0 ; i < len ; i++)
      total_time += all_items[i].track.duration_ms;
    /*-------------*/
    total_time = Math.floor(total_time/1000);
    minutes = Math.floor(total_time/60);
    seconds = total_time - minutes*60;
    response += '<h3> The total length of this playlist is ' + minutes.toString() + ' minutes and ' + seconds.toString() + ' seconds' + '</h3>';
       response += '<a href = "/" <font size="3"> CLICK HERE TO GO BACK TO THE MAIN PAGE </font></td>';
       response += '</html>';
       res.send(response);
  } );
});

app.get('/users', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/form.html'));
});

app.post('/add', function(req, res, next){
	options.url = 'https://api.spotify.com/v1/users/' + req.body.user_id + '/playlists/' + req.body.playlist_id + '?fields=name';
  request(options, function(err, _res, body) {  
    var data = JSON.parse(body);
    console.log(data);
    if (typeof data.error === "undefined"){
      res.redirect('/success');
      user_id.push(req.body.user_id);
      playlist_id.push(req.body.playlist_id);
    }
    else
      res.redirect('/failure');
  });
});

app.get('/success', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/success.html'));
});

app.get('/failure', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/failure.html'));
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
