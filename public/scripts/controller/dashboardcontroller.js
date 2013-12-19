define(['jquery', 'view/useractivity'], function($) {
   
   var DashboardController = function() {
       
   } 
   
   DashboardController.prototype.load = function() {
       $.getJSON('/dashboard/data', null, function(response) {
            $('.activityGraph').userActivityGraph({
                data:response.userdata
            });
       });
   }
      
   
   return DashboardController;
   
});