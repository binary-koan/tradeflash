var https = require('https');

var APP_KEY = 'AC9BED97D20BECADA9291807EC6B2A3B';
var APP_SECRET = 'EA94F06BA11CF67F41D629218A387084';

var USER_KEY = '3DB4C5B8BC17F30B6088A5BE243A04A5';
var USER_SECRET = '36E657A15A830C027114BD0F1F3DF1BF';

function apiRequest(url, cb, type) {
  // Set the options for our API call
  
  var key = type === "user" ? USER_KEY : APP_KEY;
  var secret = type === "user" ? USER_SECRET : APP_SECRET;
  
  var options = {
	  hostname: 'api.trademe.co.nz',
	  path: url,
	  method: 'GET',
	  headers: {
	    'Authorization': 'Oauth oauth_consumer_key="' + key + '", oauth_signature_method="PLAINTEXT", oauth_signature="' + secret + '&"'
	  }
	};
  
  // Define our callback to work with the response
	var callback = function(response) {
	  var str = '';
	  // When we receive data
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
    
    // End event for the call
	  response.on('end', function () {
	    // Callback acting on the response
	    cb(str);
	  });
	  
	  // Error event(?)
	}
  
  // Execute
	var req = https.request(options, callback);
	req.end();
}

// same as method above but uses user keys
function apiUserRequest(url, cb){
  
}

module.exports = {
  apiRequest: apiRequest
};
