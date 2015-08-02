// Import jQuery and plugins into the global namespace
var jQuery = require('../vendor/jquery/dist/jquery');
window.$ = window.jQuery = jQuery;
require('../vendor/bootstrap/dist/js/bootstrap');

// Configure mithril routes
var m = require('../vendor/mithril/mithril');
var socket = require('./util/socket');
var ROUTES = require('./util/routes');
var Categories = require('./components/categories')(socket);
var Images = require('./components/images')(socket);

var paths = {};
paths[ROUTES.categories] = Categories;
paths[ROUTES.images] = Images;

m.route(document.getElementById('main'), ROUTES.categories, paths);
