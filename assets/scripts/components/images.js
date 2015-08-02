var m = require('../../vendor/mithril/mithril');
var ROUTES = require('../util/routes');
var socket;

var Images = {
  list: m.prop([]),
  
  controller: function() {
    var categories = m.route.param('categories');
    socket.emit('get category', categories);
    //for (var i = 0; i < categories.length; i++) {
      // emit 'get category' or something with category
    //  socket.emit('get category', categories[i]);
    //}
    
    socket.on('sending listings', function(listings) {
      this.list = listings.listings;
    });
    
    socket.emit('get items');
    
    return {
      list: Images.list
    };
  },
  
  view: function(ctrl) {
    return m('.row', ctrl.list().map(function(item) {
      return m('.col-md-4.col-xs-6', m('.thumb',
        m('a.thumbnail.listing', {
          href: 'http://www.trademe.co.nz/Browse/Listing.aspx?id=' + item.id,
          target: "_blank", // open in new tab
          config: item.config
        }, [
          m('img.img-responsive', { src: item.url }),
          m('.overlay'),
          m('button.btn-warning.watchlist-btn', 'add watchlist', { onclick: addToWatchList }),
          m('p', '+' + item.likes),
          m('.pricetag', [
            m('span.sr-only', 'Current bid: '),
            m('span', item.price)
          ]),
          m('h5.title', item.title)
        ])
      ));
    }));
  }
};

var itemIndices = [], // for selecting next item swap
  nextItem = 0; // index of next item to to swap 

module.exports = function(s) {
  socket = s;
  
  socket.on('update', function(item) {
    if (m.route() != ROUTES.images) return;
    
    // item = { imageURL: item };
    
    console.log(item);
    
    // fade in/out animations
    $('div a.thumbnail.listing').eq(0)
      .fadeTo(500, 0.001, "easeOutCubic", function() {
        Images.list()[nextItem] = item;
        nextItem = (nextItem + 1) % 10;
        item.config = fadeIn(item);
        m.redraw();
      });
  });
  
  socket.on('sending items', function(items) {
    if (m.route() != ROUTES.images) return;
    
    console.log('sending items');
    for (var i = 0; i < items.length; i++) {
      items[i] = { url: items[i] };
    }
    
    // next
    items.forEach(function (d, i){
      itemIndices.push(i);
    });
    shuffleArray(itemIndices);
    
    Images.list(items);
    m.redraw();
  });
  
  return Images;
};

// utility methods

function fadeIn(item){
  return function(elem){
    $(elem).css('opacity', 0);
    $(elem).fadeTo(500, 1, "easeOutCubic", fadedIn);
    function fadedIn(){
      item.config = undefined;
    }
  }
}

function addToWatchList(item){
  return function(elem) {
    $(item).addClass("active watchlist-added") 
    // increments 'like' counter
    // TODO: tell server
    item.likes++;
    socket.emit('add to watchlist', item.id);
  }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// add custom easing function
$.easing.easeOutCubic = function (x, t, b, c, d) {
  return c*((t=t/d-1)*t*t + 1) + b;
}