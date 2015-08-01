var m = require('../../vendor/mithril/mithril');
var socket = require('../util/socket');
var ROUTES = require('../util/routes');

var Images = {
  list: m.prop([]),
  
  setup: function() {
    socket.on('update', function(msg) {
      if (m.route() != ROUTES.images) return;
      
      console.log(msg);
      Images.list().push(msg.url);
      Images.list().shift();
      m.redraw();
    });
    
    socket.on('sending items', function(items) {
      if (m.route() != ROUTES.images) return;
      
      console.log('sending items');
      Images.list(items);
      m.redraw();
    });
  },
  
  controller: function() {
    socket.emit('get items');
    
    return {
      list: Images.list
    };
  },
  
  view: function(ctrl) {
    return m('.row', ctrl.list().map(function(src) {
      return m('.col-md-4.col-xs-6', m('.thumb',
        m('a.thumbnail.listing', { href: '#' }, [
          m('img.img-responsive', { src: src }),
          m('.overlay'),
          m('.pricetag', [
            m('span.sr-only', 'Current bid: '),
            m('span', '$10.00')
          ]),
          m('h5.title', 'Item title')
        ])
      ));
    }));
  }
};

module.exports = Images;
