(function() {

  var Images = {
    list: m.prop([]),
    
    controller: function() {
      return {
        list: Images.list()
      };
    },
    
    view: function(ctrl) {
      return m('.row', ctrl.list.map(function(src) {
        return m('.col-md-4.col-xs-6', m('.thumb',
          m('a.thumbnail', { href: '#' },
            m('img.img-responsive', { src: src })
          )
        ));
      }));
    }
  };
  
  m.render(document.getElementById('images'), Images);

  var socket = io();

  socket.on('update', function(msg) {
    console.log(msg);
    Images.list().push(msg.url);
    Images.list().shift();
    m.render(document.getElementById('images'), Images);
  });

  socket.emit('get items');
  socket.on('sending items', function(items) {
    console.log('sending items');
    Images.list(items);
    m.render(document.getElementById('images'), Images);
  });
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