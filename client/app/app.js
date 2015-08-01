(function() {
  var socket = io();
  
  var ROUTES = {
    index: '/',
    images: '/flow'
  };
  
  var StartPage = {
    controller: function() { return {} },
    
    view: function(ctrl) {
      return m("a", { href: ROUTES.images, config: m.route }, 'Default images');
    }
  };

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
          m('a.thumbnail', { href: '#' },
            m('img.img-responsive', { src: src })
          )
        ));
      }));
    }
  };
  
  Images.setup();
  
  var routeControllers = {};
  routeControllers[ROUTES.index] = StartPage;
  routeControllers[ROUTES.images] = Images;
  
  m.route(document.getElementById('main'), ROUTES.index, routeControllers);
})();

$(function() {
    $(".thumbnail")
        .mouseover(function() {
           // $(this).text("sfdasfasdfdas");
           $(".title").html("sweatshirt");
        })
        .mouseout(function() {
             $(".title").html("");
        });
});

$(function() {
    $(".catagory")
        .click(function() { 
          alert("clicked");
        })
        .mouseout(function() {
             $(".title").html("");
        });
});

