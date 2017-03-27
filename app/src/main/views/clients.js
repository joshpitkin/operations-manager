(function(){

  angular
       .module('main')
       .directive('clientsView',['RxEService','$mdDialog',clientsController])

 function clientsController(RxEService){
     var controller = ['$scope','$mdDialog',function ($scope,$mdDialog) {
         console.log(RxEService.config)
           // Appending dialog to document.body to cover sidenav in docs app
           $scope.showClientPrompt = function(ev){
             function DialogController($scope, $mdDialog) {
               $scope.clients = RxEService.getClients()
               $scope.selectedClient = ""
                $scope.hide = function() {
                  $mdDialog.hide();
                };
                $scope.cancel = function() {
                  $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                  $mdDialog.hide(answer);
                };
              }
              $mdDialog.show({
                controller: DialogController,
                templateUrl: 'src/main/views/clientSelector.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
              })
              .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
              }, function() {
                $scope.status = 'You cancelled the dialog.';
              });
            };
    }]

    return {
      restrict: 'EA', //Default in 1.3+
      scope: {
          datasource: '=',
          add: '&',
      },
      controller: controller,
      templateUrl: 'src/main/views/clients.html'
  };
 }
})();
