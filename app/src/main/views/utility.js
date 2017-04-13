(function(){

  angular
       .module('main')
       .directive('rxUtility',['RxEService','$mdDialog',utilitiesController])

 function utilitiesController(RxEService){
     var controller = ['$scope','$rootScope','$mdDialog',function ($scope,$rootScope,$mdDialog) {

           $scope.defaultClient = {client_info:{},parameters:{},activity:[],documents:[]}
           $scope.clientIsLoaded = false
           $scope.dirtyList = []
           $scope.fileList = []
           $scope.loadClients = function(){
             $rootScope.loading = true
             $scope.clients = []
             RxEService.getClients($scope.utility).then(function(clients){
               if(clients) $scope.clients = clients
                $rootScope.loading = false
             })
           }
           $scope.$on('changeUtility', function () {
              $scope.utility = $rootScope.utility
               $scope.loadClients()

           });
          //  $scope.clients = RxEService.getClients($scope.utility)
           $scope.entity_types = RxEService.getEntityTypes()
           $scope.unitedStates = RxEService.getUnitedStates()
           $scope.loadClient = function(client_id){
             $rootScope.loading = true
             RxEService.getUtilityInfo(client_id,$scope.utility).then(function(obj){
               $scope.client = obj
               $scope.setReady()
             })
           }
           $scope.loadClients()
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
                  client_id:$scope.client.client_info.client_id,
                  client_name:$scope.client.client_info.client_name,
                  change_description: newActivity,
                  change_user: window.app.user.user_id,
                  change_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
                  isDirty:true
                }
                $scope.client.activity.push(actObj)
                $scope.makeDirty('client_info','client_status')
              }, function() {});
            };
           $scope.setReady = function(){
             $scope.client_uid = $scope.utility.name[0] + $scope.client.client_info.client_id.value
             $scope.clientIsLoaded = true
             $rootScope.showUtility = true
             $rootScope.loading = false
             $scope.currentTab = 'Contact'
           }
           $scope.showClientAdd = function(ev) {
              var confirm = $mdDialog.prompt()
                .title('What is the new ' + $scope.utility.identifier)
                .placeholder('Client ID')
                .ariaLabel('Client ID')
                .targetEvent(ev)
                .ok('Add Client')
                .cancel("Cancel");

              $mdDialog.show(confirm).then(function(newClient) {
                $rootScope.loading = true
                if(newClient.search(/[^a-zA-Z]+/) < 0){
                  var data = {
                    client_type:$scope.utility.name.toLowerCase(),
                    client_name:newClient.toUpperCase()
                  }
                  RxEService.genericPost("insert-client",data).then(function(msg){
                    $scope.client = angular.copy($scope.defaultClient);
                    $scope.client.client_info = RxEService.prepareCleanObject(msg[0])
                    $scope.clients.push(msg[0])
                    $scope.setReady()
                  })

                }
              }, function() {});
            };
           $scope.makeDirty = function(obj_type,obj_name){
            //  console.log("blaaa")
             if(typeof $scope.client[obj_type][obj_name]['pristine'] == 'undefined'){
               $scope.client[obj_type][obj_name]['pristine'] = true
             }
             if(typeof $scope.dirtyList[obj_type] == 'undefined') $scope.dirtyList[obj_type] = []
             if($scope.dirtyList[obj_type].indexOf(obj_name) == -1){
                $scope.dirtyList[obj_type].push(obj_name)
             }
             if($rootScope.showingSave) return
             RxEService.showSave().then(function(){

               var dirtyObj = RxEService.prepareDirtyObject($scope.client)
               console.log(dirtyObj)
              //  RxEService.saveChanges(dirtyObj,$scope.utility).then(function(msg){
              //    //todo: convert dirty object to clean object HERE
              //  })
             })
           }
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
          utility:"=utility"
      },
      controller: controller,
      templateUrl: 'src/main/views/utility.html'
  };
 }
})();
