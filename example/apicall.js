var app = require('express')();
var http = require('http');
var https = require('https');

var oauthKey = '3DB4C5B8BC17F30B6088A5BE243A04A5';
var oauthSecret = '36E657A15A830C027114BD0F1F3DF1BF';

var trademeKey = 'AC9BED97D20BECADA9291807EC6B2A3B';
var trademeSecret = 'EA94F06BA11CF67F41D629218A387084';



app.get('/', function(req, res){
	var options = {
	  hostname: 'api.trademe.co.nz',
	  path: '/v1/Listings/925027664.json',
	  method: 'GET',
	  headers: {'Authorization': 'Oauth oauth_consumer_key="'+trademeKey+'", oauth_signature_method="PLAINTEXT", oauth_signature="'+trademeSecret+'&"'}
	};

	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  response.on('end', function () {
	    console.log(str);
	  });
	}

	var req = https.request(options, callback);
	req.end();
});

app.listen(3000, function(){
  console.log('listening on *:3000');
});