var https = require('https');

var APP_KEY = 'AC9BED97D20BECADA9291807EC6B2A3B';
var APP_SECRET = 'EA94F06BA11CF67F41D629218A387084';

function apiRequest(url, cb) {
  // Set the options for our API call
  var options = {
	  hostname: 'api.trademe.co.nz',
	  path: url,
	  method: 'GET',
	  headers: {'Authorization': 'Oauth oauth_consumer_key="' + APP_KEY + '", oauth_signature_method="PLAINTEXT", oauth_signature="' + APP_SECRET + '&"'}
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
	    // ...
	    
	    cb(str);
	    
	     // var listing = JSON.parse(str);

      //   var currentPrice = listing.MinimumNextBidAmount;
      //   var photoURL = listing.Photos[0]
      //       .Value
      //       .FullSize;

      //   var conciseListing = {
      //       title: listing.Title,
      //       currentPrice: currentPrice,
      //       buyNowPrice: listing.BuyNowPrice, // could be undefined
      //       mainPhoto: photoURL, // could be undefined
      //       viewCount: listing.ViewCount
      //   };

      //   response.send(JSON.stringify(conciseListing));
      
      
	  });
	  
	  // Error event(?)
	}
  
  // Execute
	var req = https.request(options, callback);
	req.end();
}

module.exports = {
  apiRequest: apiRequest
};
