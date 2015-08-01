(function(){

  'use strict';
  var express = require('express');
  var reloader = require('connect-livereload')
  var app = express();

  app.use(reloader());
  app.use(express.static('./client'));
  
  app.get('/test.json', function(req, res) {
    res.send({'number': 4});
  });

  var port = process.env.PORT || 9000;
  var ip = process.env.IP || 'localhost';
  app.listen(port, ip, function(){
    console.log('App Listening on ' + ip + ':' + port);
  });

})();
