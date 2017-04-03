(function(){

  angular
       .module('main')
       .directive('rxUtility',['RxEService','$mdDialog',utilitiesController])

 function utilitiesController(RxEService){
     var controller = ['$scope','$mdDialog',function ($scope,$mdDialog) {
           $scope.client = {}
           $scope.clients = RxEService.getClients()
           $scope.entity_types = RxEService.getEntityTypes()
           $scope.unitedStates = RxEService.getUnitedStates()
           $scope.loadClient = function(client_id){
             $scope.currentTab = 'Contact'
             $scope.client = RxEService.getUtilityInfo(client_id)
           }
           $scope.showActivityAdd = function(ev) {
              var confirm = $mdDialog.prompt()
                .title('What activity would you like to record?')
                .placeholder('Brief Description')
                .ariaLabel('Brief Description')
                .targetEvent(ev)
                .ok('Add Activity')
                .cancel("Cancel");

              $mdDialog.show(confirm).then(function(newActivity) {
                var actObj = {
                  client_id:$scope.client.client_id,
                  change_description: newActivity,
                  change_user: window.app.user.user_id,
                  change_datetime: "3/12/1985"
                }
                $scope.client.activity.push(actObj)
                //add service
              }, function() {});
            };
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
          config:"=config"
      },
      controller: controller,
      templateUrl: 'src/main/views/utility.html'
  };
 }
})();
