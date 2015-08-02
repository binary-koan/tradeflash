$(function() {
    $("#catagoryButton2")
        .click(function() {
         alert("clicked");
         
        })
        .mouseout(function() {
         if(document.getElementById('catagoryCheckbox2').checked){
         }
            
        });
        
        //
         $("#submitButton")
        .click(function() {
         alert("clicked");
         //check each checkbox, add to list of wanted catagories if checked 
          if(document.getElementById('catagoryCheckbox2').checked){
              //add to list 
         }
        })
        .mouseout(function() {
         if(document.getElementById('catagoryCheckbox2').checked){
         }
            
        });
});