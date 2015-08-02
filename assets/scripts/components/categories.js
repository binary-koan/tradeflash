var m = require('../../vendor/mithril/mithril');
var ROUTES = require('../util/routes');
var socket;

var Categories = {
  
  list: m.prop([]),
  
  controller: function() {
    socket.emit('get items');
    
    return {
      list: Categories.list
    };
  },
  
  
   //<label id="catagoryButton1" class="btn btn-primary catagoryButton">
        //  <input id = "catagoryCheckbox1" type="checkbox" autocomplete="off"><img src="https://trademe.tmcdn.co.nz/photoserver/full/374118004.jpg" width="100" height="100">
        //  Hottest
      //  </label>
  
  view: function(ctrl) {
    return m('div', [
      m('.row.checkboxes', ctrl.list().map(function(object) {
        return m('.col-md-4.col-xs-6', m('label.btn.btn-default.catagoryButton.btn-block', {
          onclick:function(event){
            $(event.target).toggleClass("active")
          }
        }, [
          m('input.sr-only[type=checkbox]', { id: object.id }), m('label', { for: object.id }, object.name)
        ]));
      })),
      
      m('button.btn.btn-primary.catagoryButton.btn-block', {
        onclick:function(event) {
          console.log('getting categories');
          getChosenCategories();
        }
      }, m('label',"Submit"))
    ]);
  }
};

module.exports = function(s) {
  socket = s;
  
  socket.on('sending categories', function(items) {
    if (m.route() != ROUTES.categories) return;
    
    console.log('sending items');
   
    Categories.list(items);
    m.redraw();
  });
  
  return Categories;
};

function getChosenCategories(){
 var chosenCategories = [];
  $("#main .checkboxes input[type=checkbox]").each(function() {
    if($(this).is(":checked")) {
      console.log('is checked');
      chosenCategories.push($(this).attr("id"));
    }
  });
  
  console.log('chosen categories: ' + chosenCategories);
  
  //send list somewhere
  m.route(ROUTES.images, { categories: chosenCategories});
}

