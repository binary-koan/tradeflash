// Import jQuery and plugins into the global namespace
var jQuery = require('../vendor/jquery/dist/jquery');
window.$ = window.jQuery = jQuery;
require('../vendor/bootstrap/dist/js/bootstrap');

// Configure mithril routes
var m = require('../vendor/mithril/mithril');
var ROUTES = require('./util/routes');
var StartPage = require('./components/startpage');
var Images = require('./components/images');
Images.setup();

var paths = {};
paths[ROUTES.index] = StartPage;
paths[ROUTES.images] = Images;

m.route(document.getElementById('main'), ROUTES.index, paths);
