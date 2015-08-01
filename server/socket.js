module.exports = function(http) {
  var categories = require('./categories');
  var io = require('socket.io')(http);
  var fs = require('fs');

  function categoryUpdater(categories) {
    return function() {
      for (var category in categories) {
        io.emit('update ' + category, categories[category].next());
      }
    };
  }
  
  var items = [];
  
  categories.apiRequest('/v1/Search/General.json?category=3720', function(data) {
    data = JSON.parse(data);
    
    for (var i = 0; i < data['List'].length; i++) {
      // Cheat and get the full image instead of the thumbnail
      items.push(data['List'][i]['PictureHref'].replace(/\/thumb\//, '/full/'));
    }
    
    console.log('got items!');
    console.log(items.length);
  });

  io.on('connection', function(socket) {
    console.log('Client connected!');
    
    socket.on('get items', function() {
      socket.emit('sending items', items.slice(0, 9));
    });
  });

  // categories.load(function(categories) {
  //   setInterval(categoryUpdater(categories), 10000);
  // });
  
  var i = 9;
  setInterval(function() {
    i++;
    if (i >= items.length) {
      i = 9;
    }
    io.emit('update', { url: items[i] });
  }, 10000);
  
  // gets all categories, puts it in a file
  (function loadCategories(){
    categories.apiRequest('/v1/Categories.json', function (categories){
      fs.writeFile("server/res/categories.json", categories, function(err) {
        if(err){
          return console.log("failed to write categories to file", err);
        }
        console.log("wrote categories to server/res/categories.json");
      });
    });
  })();
};