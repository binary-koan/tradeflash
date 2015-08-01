module.exports = function() {
  var express = require('express');
  // var reloader = require('connect-livereload');
  
  var app = express();
  // app.use(reloader());
  app.use(express.static('./client'));
  
  return app;
};
