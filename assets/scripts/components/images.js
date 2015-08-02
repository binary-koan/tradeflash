var m = require('../../vendor/mithril/mithril');
var ROUTES = require('../util/routes');
var socket;

var Images = {
  list: m.prop([]),
  categories: [],
  desiredCategory: 0,

  controller: function() {
    var categories = m.route.param('categories');
    if (typeof(categories) == 'string') {
      categories = categories.split(',');
    }
    Images.categories = categories;
    Images.desiredCategory = 0;

    for (var i = 0; i < categories.length; i++) {
      // emit 'get category' or something with category
      socket.emit('get category', categories[i]);
      socket.emit('listen to category', categories[i]);
      //console.log('IMAGES.JS categories: ' + categories[i]);
      //console.log('IMAGES.JS categories: ' + getValue(categories[i]));
    }

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
          m('button.btn.btn-default.watchlist-btn', 'Add to Watchlist', { onclick: addToWatchList }),
          m('p.likes-counter', '+' + (item.likes || Math.round(Math.random()*10))),
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

// utility methods

var itemIndices = [], // for selecting next item swap
  nextItemIndex = 0; // index of next item to to swap

function fadeIn(item){
  return function(elem){
    $(elem).css('opacity', 0);
    $(elem).fadeTo(500, 1, "easeOutCubic", fadedIn);
    function fadedIn(){
      item.config = undefined;
    }
  }
}

function getValue(key) {
  //console.log('GET VALUE: ' + key);
  for (var item in JSON.parse(localStorage.categoryList)) {
    //console.log(item);
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

// Exports

module.exports = function(s) {
  socket = s;
  
  socket.on('sending listings', function(listings) {
    if (m.route().indexOf(ROUTES.images) != 0) return;
    
    if (Images.list().length === 0) {
      Images.list(listings.listings);
      
      listings.listings.forEach(function (d, i){
        itemIndices.push(i);
      });
      shuffleArray(itemIndices);
    }
    else {
      var list = Images.list();
      for (var i = 0; i < 3; i++) {
        var random = Math.floor(Math.random() * 9);
        list[random] = listings.listings[random];
      }
    }
    m.redraw();
  });

  socket.on('next listing', function(data) {
    if (m.route().indexOf(ROUTES.images) != 0) return;
    if (data.category !== Images.categories[Images.desiredCategory]) return;
    
    setTimeout(function() {
      Images.desiredCategory = (Images.desiredCategory + 1) % Images.categories.length;
    }, 1000);
    
    var item = data.listing;
    if (!item) {
      return;
    }

    // fade in/out animations
    console.log("next item", nextItemIndex);
    console.log(itemIndices);
    var currentItemIndex = itemIndices[nextItemIndex];
    nextItemIndex = (nextItemIndex + 1) % 9;
    
    $('#main a.thumbnail.listing').eq(currentItemIndex)
      .fadeTo(500, 0.001, "easeOutCubic", function() {
        Images.list()[currentItemIndex] = item;
        item.config = fadeIn(item);
        m.redraw();
      });
  });

  return Images;
};
