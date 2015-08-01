var https = require('https');

var trademeKey = 'AC9BED97D20BECADA9291807EC6B2A3B';
var trademeSecret = 'EA94F06BA11CF67F41D629218A387084';

function Category(name) {
  this.name = name;
  this.values = [];
  this.apiRequest();
}

Category.prototype.next = function() {
  return this.values.shift();
};

function apiRequest(url, cb) {
  // Do API request and add results to this.values[]
  
  // Set the options for our API call
  var options = {
	  hostname: 'api.trademe.co.nz',
	  path: url,
	  method: 'GET',
	  headers: {'Authorization': 'Oauth oauth_consumer_key="'+trademeKey+'", oauth_signature_method="PLAINTEXT", oauth_signature="'+trademeSecret+'&"'}
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
};

module.exports = {
  load: function(callback) {
    // Do API call, add Category instances to categories
    
    // var topLevelCategories = apiRequest('/v1/Categories.json');
    
    /*
    for category in data.topLevelCategories:
      categories.push(new Category(category.name));
    */
    // for (var item in topLevelCategories) {
    //   categories.push(new Category(item.name));
    // }
    
    // return categories;
  },
  
  apiRequest: apiRequest
};
