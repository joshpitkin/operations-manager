(function(){

  angular
       .module('main')
       .directive('rxUtility',['RxEService','$mdDialog',utilitiesController])

 function utilitiesController(RxEService){
     var controller = ['$scope','$rootScope','$mdDialog',function ($scope,$rootScope,$mdDialog) {

           $scope.defaultClient = {client_info:{},parameters:{},activity:[],documents:[]}
           $scope.clientIsLoaded = false
           $scope.fileList = []
           $scope.dummy = {
             active:false,
             client_uid:''
           }
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
           $scope.addActivity = function(newActivity,markDirty){
             drty = (typeof markDirty == 'undefined')?true:markDirty
             var actObj = {
               client_id:$scope.client.client_info.client_id.value,
               client_name:$scope.client.client_info.client_name.value,
               change_description: newActivity,
               change_user: window.app.user.user_id,
               change_datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
               dirty:drty
             }
             $scope.client.activity.push(actObj)
             if(drty) $scope.beginSave()
           }
           $scope.showActivityAdd = function(ev) {
              var confirm = $mdDialog.prompt()
                .title('What activity would you like to record?')
                .placeholder('Brief Description')
                .ariaLabel('Brief Description')
                .targetEvent(ev)
                .ok('Add Activity')
                .cancel("Cancel")

              $mdDialog.show(confirm).then(function(newActivity){
                $scope.makeDirty('client_info','client_status')
                addActivity(newActivity)
              }, function() {console.log("cancelled new activity")})
            };
           $scope.setReady = function(){
             $scope.dummy.client_uid = $scope.utility.label[0] + $scope.client.client_info.client_id.value
             $scope.dummy.active = $scope.client.client_info.client_status.value == "Active"
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
                    client_type:$scope.utility.type,
                    client_name:newClient.toUpperCase()
                  }
                  RxEService.genericPost("insert-client",data).then(function(msg){
                    $scope.client = angular.copy($scope.defaultClient);
                    $scope.client.client_info = RxEService.prepareCleanObject(msg[0])
                    $scope.clients.push(msg[0])
                    $scope.addActivity("Added " + $scope.client.client_info.client_name.value + " to RxEBATE client base",false)

                    $scope.setReady()
                  })

                }
              }, function() {});
            };
           $scope.changeField = function(item_name){
             switch(item_name){
               case "client_status":

                $scope.client.client_info.client_status.value = ($scope.dummy.active)?"Active":"Inactive"
               break;
             }
             $scope.beginSave()
           }
           $scope.beginSave = function(item_name){

             if($rootScope.showingSave) return
             RxEService.showSave().then(function(){
               //aggregate changes
               $rootScope.loading = true
               var saveObj = RxEService.prepareSaveObject($scope.client)
               if(saveObj.length == 0) return;
               //add changes to change-log
               var activityString = "Changed " + saveObj.map(function(r){
                 var newVal = r.item_val
                 if(r.item_name == 'format_instructions'){
                   return r.item_name.replace(/_/g, ' ')
                 }
                 if(typeof newVal == 'object'){
                   newVal = JSON.stringify(r.item_val).replace(/"/g, '').slice(0,-1).slice(1).replace(/,/g,", ").replace(/_/g, ' ')
                 }

                 return r.item_name.replace(/_/g, ' ') + " to " + newVal
               }).join(", ")
               //add change-log to SAVE Object
               $scope.addActivity(activityString)
               $scope.client.activity
                .filter(function(act){return act.dirty === true})
                .map(function(newAct){saveObj.push({
                  command:"insert",
                  item_type:"activity",
                  client_id:$scope.client.client_info.client_id.value,
                  item_val:{client:newAct.client_id,
                            text: newAct.change_description,
                            user:newAct.change_user
                          }
                })})

               RxEService.saveChanges(saveObj,$scope.utility).then(function(response){
                 //todo: convert dirty object to clean object HERE
                 //todo: map activity and save changes
                 if(Array.isArray(response)){
                   response.map(function(t){
                     var post = (Array.isArray(t.response))?t.response[0]:false
                     var info = t.post.item_type
                     var item = t.post.item_name
                     switch(info){
                      case 'parameters':
                          $scope.client.parameters[item]["id"] = post.parameter_id
                          $scope.client.parameters[item]["value"] = post.parameter_value
                          $scope.client.parameters[item]["original-value"] = post.parameter_value
                        break;
                      case 'activity':
                        var actObj = $scope.client.activity.filter(function(a){return a.change_description == t.post.item_val.text})
                        if(actObj.length > 0){
                          actObj[0].dirty = false
                        }
                        break;
                      case "document":
                        var doc = $scope.client.documents.filter(function(d){return d.document_description == post.document_description && d.document_name == post.document_name})
                        if(doc.length > 0){
                          doc[0].dirty = false
                          doc[0]["original-status"] = post.document_status
                          doc[0]["document_description"] = post.document_description
                          doc[0]["document_id"] = post.document_id
                        }
                        break;
                      case "client_info":
                        $scope.client.client_info["client_status"]["value"] = post.client_status
                        $scope.client.client_info["client_status"]["original-value"] = post.client_status
                        $scope.client.client_info["client_name"]["value"] = post.client_name
                        $scope.client.client_info["client_name"]["original-value"] = post.client_name
                        break;
                     }


                   })
                 }
                 $rootScope.loading = false
                 $rootScope.showingSave = false
                 RxEService.hideSave()
               })
             })
           }
           $scope.uploadFile = function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event){
             var newFile = RxEService.uploadFile($file).then(function(msg){
               RxEService.genericInput($event,"What file is this?","New File").then(function(newFile){
                 msg.document_description = newFile
                 msg.document_status = "Active"
                 msg.dirty = true
                 $scope.client.documents.push(msg)
                 $scope.beginSave()
               },function(){
                 console.log("TO DO: remove file")
               })
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
