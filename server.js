var app = require('./server/app')();
var http = require('http').Server(app);
require('./server/socket')(http);

var port = process.env.PORT || 9000;
var ip = process.env.IP || 'localhost';

http.listen(port, ip, function(){
  console.log('App Listening on ' + ip + ':' + port);
});
