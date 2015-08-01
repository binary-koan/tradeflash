(function(){
  'use strict';

  initialize('title');

  function initialize(elementId){

    var runner = Runner(elementId);
    console.log(runner)
    runner.update('Check out HackReactor');

    ///////////////////////

    function Runner(elementId){
      var instance;

      instance = {

        element: document.getElementById(elementId),
        update: update

      };

      return instance;

      //////////////////

      function update(value){
        this.element.innerHTML = value;
      }
    }


  }

})();