module.exports = function(http) {
  var categories = require('./categories');
  var io = require('socket.io')(http);

  function categoryUpdater(categories) {
    return function() {
      for (var category in categories) {
        io.emit('update ' + category, categories[category].next());
      }
    };
  }

  io.on('connection', function() {
    console.log('Client connected!');
  });

  categories.load(function(categories) {
    setInterval(categoryUpdater(categories), 10000);
  });

  // Dummy updater
  setInterval(function() {
    io.emit('update');
  }, 10000);
};
