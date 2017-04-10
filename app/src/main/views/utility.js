(function(){

  angular
       .module('main')
       .directive('rxUtility',['RxEService','$mdDialog',utilitiesController])

 function utilitiesController(RxEService){
     var controller = ['$scope','$mdDialog',function ($scope,$mdDialog) {

           $scope.client = {activity:[],documents:[]}
           $scope.clientIsLoaded = false
           $scope.dirtyList = []
           $scope.fileList = []

           $scope.clients = RxEService.getClients()
           $scope.entity_types = RxEService.getEntityTypes()
           $scope.unitedStates = RxEService.getUnitedStates()
           $scope.loadClient = function(client_id){
             $scope.$parent.loading = true
             $scope.currentTab = 'Contact'
             RxEService.getUtilityInfo(client_id).then(function(obj){
               $scope.client = obj
               $scope.clientIsLoaded = true
               $scope.$parent.loading = false
             })
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
                  change_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                  isDirty:true
                }
                $scope.client.activity.push(actObj)
                $scope.makeDirty('activity')
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
           $scope.makeDirty = function(e){
             if($scope.dirtyList.indexOf(e) == -1){
                $scope.dirtyList.push(e)
             }
             RxEService.showSave()
           }
          //  $scope.showAlert = function(ev,message,title) {
          //     $mdDialog.show(
          //       $mdDialog.alert()
          //         .parent(angular.element(document.body))
          //         .clickOutsideToClose(true)
          //         .title(title)
          //         .textContent(message)
          //         .ariaLabel(title)
          //         .ok('Okay')
          //         .targetEvent(ev)
          //     );
          //   };
           $scope.uploadFile = function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event){
             var newFile = RxEService.uploadFile($file).then(function(msg){
                var fileDesc = $mdDialog.prompt()
                  .title('What File is This?')
                  .placeholder('File Name')
                  .ariaLabel('File Name')
                  .targetEvent($event)
                  .ok('OK')
                  .cancel("CANCEL");

                $mdDialog.show(fileDesc).then(function(fileObj) {
                  msg.description = fileObj
                  $scope.client.documents.push(msg)
                }, function(fileObj) {
                  console.log(fileObj)
                });
             },function(msg){
               RxEService.genericAlert(
                 $event,
                 "There was an error uploading your file, Please try again.",
                 "File NOT uploaded"
               )
             })
             }
           $scope.removeFile = function(file,$event){
             RxEService.genericConfim($event,"Are you sure you want to remove this file?","Remove File").then(function(resp){
               RxEService.genericPost("remove-file",file).then(function(msg){
                 var ind = $scope.client.documents.indexOf(file)
                 $scope.client.documents.splice(ind,1)
               })
             })
           }
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
