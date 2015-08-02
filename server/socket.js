var data = require('./data');
var trademe = require('./trademe');

var categoryTickers = {};

function setupSocket(socket) {
  data.getCategories(function(categories){
    console.log('sending list of categories');
    socket.emit('sending categories', categories);
    //console.log(categories);
  });
  // Return the first 9 items in a category upon request
  socket.on('get category', function(id) {
    //id.split(',');
    data.getListings(id, function(listings) {
      console.log('RECEIVED: ' + id);
      socket.emit('sending listings', { category: id, listings: listings.slice(0, 9) });
    });
  });
  
  var categoryListeners = {};
  
  socket.on('listen to category', function(id) {
    categoryTickers[id] = categoryTickers[id] || { listeners: [], index: 0 };
    categoryListeners[id] = categoryTickers[id].listeners.push(socket);
  });
  
  socket.on('disconnect', function() {
    // Delete all our listeners
    for (var id in categoryListeners) {
      if (categoryListeners.hasOwnProperty(id)) {
        categoryTickers[id].listeners.splice(categoryListeners[id], 1);
      }
    }
  });
  
  socket.on('add to watchlist', function(itemId){
    // increment likes count by one
    if (data.itemLikes[itemId]) data.itemLikes[itemId]++;
    else data.itemLikes[itemId] = 1;
    trademe.apiRequest('/v1/MyTradeMe/WatchList/' + itemId + '.json', function(strRes) {
      var response = JSON.parse(strRes);
      if (response.Success)
        console.log("added something to watchlist!");
      else console.log("failed adding something to watchlist");
    }, "user");
  });
}

function updateListeners(id, index, listeners) {
  data.getListings(id, function(listings) {
    listeners.forEach(function(socket) {
      socket.emit('next listing', { category: id, listing: listings[index] });
    });
  });
}

setInterval(function() {
  for (var id in categoryTickers) {
    if (categoryTickers.hasOwnProperty(id)) {
      var listeners = categoryTickers[id].listeners;
      categoryTickers[id].index = (categoryTickers[id].index + 1) % data.STORED_LISTINGS;
      updateListeners(id, categoryTickers[id].index, listeners);
    }
  }
}, 5000);

module.exports = function(http) {
  // var categories = require('./categories');
  var io = require('socket.io')(http);
  var fs = require('fs');
  
  io.on('connection', function(socket) {
    console.log('Client connected!');
    setupSocket(socket);
  });

  // function categoryUpdater(categories) {
  //   return function() {
  //     for (var category in categories) {
  //       io.emit('update ' + category, categories[category].next());
  //     }
  //   };
  // }
  
  // var items = [];
  
  // var trademe = require('./trademe');
  // trademe.apiRequest('/v1/Search/General.json?category='+category, function(data) {
  //   data = JSON.parse(data);
    
  //   for (var i = 0; i < data['List'].length; i++) {
  //     // Cheat and get the full image instead of the thumbnail
  //     items.push(data['List'][i]['PictureHref'].replace(/\/thumb\//, '/full/'));
  //   }
    
  //   console.log('got items!');
  //   console.log(items.length);
  // });

  // categories.load(function(categories) {
  //   setInterval(categoryUpdater(categories), 10000);
  // });
  
  // var i = 9;
  // setInterval(function() {
  //   i++;
  //   if (i >= items.length) {
  //     i = 9;
  //   }
  //   io.emit('update', { url: items[i] });
  // }, 2000);
  
  // gets all categories, puts it in a file
  // Do we need to put it in a file? see data.js:31 - Jono
  // (function loadCategories(){
  //   trademe.apiRequest('/v1/Categories.json', function (categories){
  //     fs.writeFile("server/res/categories.json", categories, function(err) {
  //       if(err){
  //         return console.log("failed to write categories to file", err);
  //       }
  //       console.log("wrote categories to server/res/categories.json");
  //     });
  //   });
  // })();
};