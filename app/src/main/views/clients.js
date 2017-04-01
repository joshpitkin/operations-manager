(function(){

  angular
       .module('main')
       .directive('clientsView',['RxEService','$mdDialog',clientsController])

 function clientsController(RxEService){
     var controller = ['$scope','$mdDialog',function ($scope,$mdDialog) {
           $scope.client = {}
           $scope.clients = RxEService.getClients()
           $scope.eTypes = [{type:'A'},{type:'B'}]
           $scope.loadClient = function(client_id){
             $scope.currentTab = 'Contact'
             $scope.client = RxEService.getClientInfo(client_id)
           }
           $scope.showClientAdd = function(ev) {
              var confirm = $mdDialog.prompt()
                .title('What is the new client ID?')
                .placeholder('Client ID')
                .ariaLabel('Client ID')
                .targetEvent(ev)
                .ok('Add Client')
                .cancel("Cancel");

              $mdDialog.show(confirm).then(function(newClient) {
                if(newClient.search(/[^a-zA-Z]+/) < 0){
                  $scope.client.client_id = newClient
                  $scope.currentTab = 'Contact'
                }
              }, function() {});
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
