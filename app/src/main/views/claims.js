(function(){

  angular
       .module('main')
       .directive('claimsView',['RxEService',claimsController])

 function claimsController(RxEService){
     var controller = ['$scope',function ($scope) {
         console.log(RxEService.config)
    }]

    return {
      restrict: 'EA', //Default in 1.3+
      scope: {
          datasource: '=',
          add: '&',
      },
      controller: controller,
      templateUrl: 'src/main/views/claims.html'
  };
 }
})();
