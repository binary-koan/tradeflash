var trademe = require('./trademe');
var itemLikes = {};

// Cached data

var topLevelCategories;
var subcategories;
var listings = [];

// Parse API responses

function parseTopLevelCategories(data) {
  // data is the JSON response from the API (as an object)
  // should return an object like [{id: <id>, name: <name>}, {id: <id2>, name: <name2>}, ...]
  var cat = [];
  //console.log(data);
  
  data.Subcategories.forEach(function (category) {
    cat.push({
      id: category.Number,
      name: category.Name
    });
  });
  
  return cat;
}

function parseSubcategories(data) {
  // data is the JSON response from the API (as an object)
  // should return an object like {<parent id>: [ {id: <id>, name: <name>}, ... ], ...}
}

function parseListings(data) {
  var listings = [];
  console.log(data);
  // data is the JSON response from API listings for category request
  // should return an object like [{title: <title>, price: <price>, hasBuyNow: <true|false>, image: <url>, ... (any other data we need) }]
  data.List.forEach(function (listing){
    //console.log(listing);
    if (listing.PictureHref) {
      listings.push({
      title: listing.Title,
      price: listing.PriceDisplay,
      hasBuyNow: listing.HasBuyNow,
      url: listing.PictureHref.replace(/\/thumb\//, '/full/'),
      id: listing.ListingId,
      likes: itemLikes[listing.ListingId]
    });
    }
  });
  console.log("parsed listing", listings);
  return listings;
}

// Initial request for categories

var topLevelCategoriesListeners = [];
var subcategoriesListeners = [];

trademe.apiRequest('/v1/Categories.json', function(data) {
  topLevelCategories = parseTopLevelCategories(JSON.parse(data));
  subcategories = parseSubcategories(JSON.parse(data));
  
  // Fire off any callbacks that were waiting for data to load
  topLevelCategoriesListeners.forEach(function(listener) {
    listener(topLevelCategories);
  });
  
  subcategoriesListeners.forEach(function(listener) {
    listener(subcategories);
  });
  
  // Delete the cache after 1 day
  setTimeout(function() {
    topLevelCategories = null;
    subcategories = null;
  }, 24 * 60 * 60 * 1000);
});

// Export simple async getter methods

module.exports = {
  STORED_LISTINGS: 50,
  
  getCategories: function(callback) {
    if (topLevelCategories) {
      callback(topLevelCategories);
    }
    else {
      topLevelCategoriesListeners.push(callback);
    }
  },

  getSubcategories: function(id, callback) {
    if (subcategories) {
      callback(subcategories[id]);
    }
    else {
      subcategoriesListeners.push(function(subcategories) {
        callback(subcategories[id]);
      });
    }
  },

  getListings: function(id, callback) {
    //console.log('listings: ' + listings);
    if (listings[id]) {
      callback(listings[id]);
    }
    else {
      trademe.apiRequest('/v1/Search/General.json?category='+id, function(data) {
        listings[id] = parseListings(JSON.parse(data));
        callback(listings[id]);
      });
      // Delete the cache after 15 min
      setTimeout(function() {
        listings[id] = null;
      }, 15 * 60 * 1000);
    }
  }
};
