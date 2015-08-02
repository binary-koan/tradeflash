var m = require('../../vendor/mithril/mithril');
var ROUTES = require('../util/routes');
var socket;

localStorage.categoryList = localStorage.categoryList || [];

var Categories = {
  view: function() {
    var categoryList = JSON.parse(localStorage.categoryList);
    
    return m('div', [
    m('.row.checkboxes', categoryList.map(function(object) {
       return m('.col-md-4.col-xs-6', m('label.btn.btn-default.catagoryButton.btn-block', {
         for: object.id,
         onclick:function(event){
           $(event.target).toggleClass("active")
         }
       }, [
         m('input.sr-only[type=checkbox]', { id: object.id }), object.name
       ]));
     })),
      
      m('button.btn.btn-success.catagoryButton.btn-block', {
        onclick:function(event) {
          console.log('getting categories');
          getChosenCategories();
        }
      }, m('label',"View Listings"))
    ]);
  }
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
  m.route(ROUTES.images, { categories: chosenCategories });
}

module.exports = function(s) {
  socket = s;
  
  socket.on('sending categories', function(items) {
    if (m.route() != ROUTES.categories) return;
   
    localStorage.categoryList = JSON.stringify(items);
    m.redraw();
  });
  
  return Categories;
};
