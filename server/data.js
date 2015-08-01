var trademe = require('./trademe');

// Cached data

var topLevelCategories;
var subcategories;
var listings;

// Parse API responses

function parseTopLevelCategories(data) {
  // data is the JSON response from the API (as an object)
  // should return an object like [{id: <id>, name: <name>}, {id: <id2>, name: <name2>}, ...]
}

function parseSubcategories(data) {
  // data is the JSON response from the API (as an object)
  // should return an object like {<parent id>: [ {id: <id>, name: <name>}, ... ], ...}
}

function parseListings(data) {
  // data is the JSON response from API listings for category request
  // should return an object like [{title: <title>, price: <price>, hasBuyNow: <true|false>, image: <url>, ... (any other data we need) }]
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
    if (listings[id]) {
      callback(listings[id]);
    }
    else {
      trademe.apiRequest('<get listing with id>', function(data) {
        listings[id] = parseListings(data);
        callback(listings[id]);
      });
      // Delete the cache after 15 min
      setTimeout(function() {
        listings[id] = null;
      }, 15 * 60 * 1000);
    }
  }
};
