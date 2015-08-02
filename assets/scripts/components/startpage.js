var m = require('../../vendor/mithril/mithril');
var ROUTES = require('../util/routes');
var socket;
var catagories = ["Charity", "Cool Auctions","Hottest", "Featured", "Surprise Me", "Newest", "Choose Catagories", "$1 Reserve", "Closing Soon"]

var Categories = {
  
  
  view: function(ctrl) {
    return m('div', [
      m('.row.checkboxes', catagories.map(function(object) {
        return m('.col-md-4.col-xs-6', m('label.btn.btn-default.catagoryButton.btn-block', {
          onclick:function(event){
            $(event.target).toggleClass("active")
          }
        }, [
          m('input.sr-only[type=checkbox]', { id: object.id }), m('label', object )
        ]));
      })),
      
      m('button.btn.btn-primary.catagoryButton.btn-block', {
         onclick:function(event) {
          console.log('getting categories');
           m.route(ROUTES.categories);
        }
      }, m('label',"Submit"))
    ]);
  }
};

module.exports = function(s) {
  return Categories;
};
