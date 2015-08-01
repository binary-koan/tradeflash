var m = require('../../vendor/mithril/mithril');
var ROUTES = require('../util/routes');

var StartPage = {
  controller: function() { return {} },
  
  view: function(ctrl) {
    return m("a", { href: ROUTES.images, config: m.route }, 'Default images');
  }
};

module.exports = StartPage;
