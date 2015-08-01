var app = require('./server/app')();
var http = require('http').Server(app);
require('./server/socket')(http);

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 9000;
var ip = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '0.0.0.0';

http.listen(port, ip, function(){
  console.log('App Listening on ' + ip + ':' + port);
});
