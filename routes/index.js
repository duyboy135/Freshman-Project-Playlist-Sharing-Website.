var express = require('express');
var router = express.Router();
var con = require('./../database/sql.js').con;
const format = require('string-format')
var session = require('client-sessions');

/*END OF DEPENDENCY*/
router.use(require('./../session.js'));
/*HTML render*/
var option = 'width="350" height="280" frameborder="0" allowtransparency="true" allow="encrypted-media"> </iframe>';
var cell_option = '<td align = "center" width = "350px" height = "180px">';
var cell_option_first_line = '<td align = "center" width = "350px" height = "50px">';
/*-----------*/

/*get iframe link*/
function getLink(_user_id, _playlist_id){
	return '<iframe src="https://open.spotify.com/embed?uri=spotify:user:' + _user_id + ':playlist:' + _playlist_id + '" ' + option;
}

/*render html front-end code*/
function display_data(user_id, playlist_id, likes, username){
  var response = '<html><style>body  {background-image: url("https://png.pngtree.com/element_origin_min_pic/16/12/28/f4557e3dfcae6c6093e606567b6c3805.jpg");background-color: #cccccc;}</style>';
    response += " <meta name='viewport' content='width=device-width, initial-scale=1'> <style>body {margin: 0;font-family: Arial, Helvetica, sans-serif;}.topnav { overflow: hidden; background-color: #333;}.topnav a {  float: right;color: #f2f2f2;text-align: center;padding: 14px 16px;text-decoration: none;font-size: 17px;}.topnav a:hover {background-color: #ddd;color: black;}.topnav a.active {background-color: #4CAF50;color: white;float:left;}a.active1 {background-color: #4CAF50;color: white;}</style></head><body><div class='topnav'><a class='active' href='/'>MyMelodies</a><a class='active1' href='/users'>Add Playlist</a><a class='active1' href='/account'>Account</a></div>";
    
    
     
  response +=  '<br></br> <table border = "5" align = "center" > ';
     response += format("<th colspan='4' style='background-color: #333; font-size: 30pt;'> <img src='http://www.stickpng.com/assets/images/59b5bb466dbe923c39853e00.png' alt='Spotify logo' style='width:200px;height:60px;'></th>")
  response += format('<tr>{}<font size="4"> RANK    </font></td>{}<font size="4"> PLAYLIST </font></td>', cell_option_first_line,cell_option_first_line);
  response += format('{}<font size="4"> PLAYLIST_INFORMATION </font></td>',cell_option_first_line); 
  response += format('{}<font size="4"> LIKES </font></td>',cell_option_first_line); 
  var len = user_id.length;
  for(var i = 0; i < len ; i++){ 
    response += '<tr>';
    response += format('{}<font size="5"> #{}</font></td>', cell_option, (i + 1));
    response += format('{}<font size="5"> {}</font></td>', cell_option, getLink(user_id[i], playlist_id[i]));
    response += format('{}THIS PLAYLIST IS FOUND AND UPLOAD TO OUR WEBSITE BY {} <br></br><a href = "/info?user_id={}&playlist_id={}"> <font size="3"> CLICK HERE FOR MORE INFORMATION OF THIS PLAYLIST </font></td>', cell_option, username[i],user_id[i], playlist_id[i]);
    response += format('{}<a href = "/like?playlist_id={}"> <font size="3"> &#x1f44d; CURRENT_LIKE = {} </font></td>',cell_option, playlist_id[i], likes[i].toString());
     response += '</tr>';
  }  
  
  response += '</table>';
  response += '</html>';
  return response;
}

/*handle GET request*/
router.get('/', function(req, res, next) {
 con.query('SELECT * from all_playlist ORDER BY number_likes DESC ', function(err, rows, fields){
      if(err)
        console.log(err);
      else{
        console.log(rows);
        var user_id = [];
        var playlist_id = [];
        var likes = [];
        var username = [];
        for (var i = 0; i < rows.length; i++){
          user_id.push(rows[i]['user_id']);
          playlist_id.push(rows[i]['playlist_id']);
          likes.push(rows[i]['number_likes']);
          username.push(rows[i]['username']);
        }
      }
      res.send(display_data(user_id, playlist_id, likes, username));    
  });
});

module.exports = router;