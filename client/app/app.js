(function(){
  'use strict';

  var socket = io();
  
  socket.on('update', function(msg) {
    console.log("Updated! " + msg);
  });

})();


$(function() {
    $(".auctionImage")
        .mouseover(function() { 
            $(this).attr("width","125");
            $(this).attr("height","125");
        })
        .mouseout(function() {
             $(this).attr("width","100");
            $(this).attr("height","100");
        });
});