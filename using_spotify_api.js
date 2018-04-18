var request = require('request');

var headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer BQAYfHTytegcwEJUcK_4GbYnqi0GyZhmGOMKVTxeYQRpyeH6twc5z6M8qnKuPssg6WGG3v4_YjEPSW26BZ7Yb9GNHTV1l7xOYySIaICEDYgFPVJVeLtRiEY5R7VMXBgNJC7YmHl56-bN5oQU22o_XzsnfF3PYM-M4Q'
};

var options = {
    url: 'https://api.spotify.com/v1/users/hrn.erdem/playlists/0ig4NgEbsAvBCprFbfdmkp',
    method: 'GET',
    headers: headers
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, function(err, res, body){
	var data = JSON.parse(body);
	console.log(data['id']);
	})

