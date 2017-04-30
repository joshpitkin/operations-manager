(function(){

  angular
       .module('main')
       .directive('rxClaims',['RxEService','$mdDialog','$mdSidenav',claimsController])

 function claimsController(RxEService){
     var controller = ['$scope','$rootScope','$mdDialog','$mdSidenav',function ($scope,$rootScope,$mdDialog,$mdSidenav) {
       $scope.method = ''
       $scope.methods = window.app.methods.filter(function(r){
         return !r.hidden
       })

       $scope.changeMethod = function(method){
         $scope.clearSelection('clients')
         $scope.clearSelection('documents')
         $scope.method = method
         $scope.config = {
           showPeriods:false,
           showClients:false,
           showDocuments:true,
           selectDocuments:true,
           selectMultipleDocuments:true,
           selectMultipleClients:true,
           selectMultiplePeriods:false,
         }
         $scope.PHI_documents = window.app.PHI_documents
         window.app.periods.map(function(p){
           p.selected = false
           return p
         })
         $scope.clients.map(function(c){
           c.selected = false
           return c
         })
         $scope.periods = []
         switch(method.name){
              case "RECEIVE":
                $scope.config.showPeriods = true
                $scope.config.showClients = true
                $scope.config.selectDocuments = false
                $scope.config.selectMultipleClients = false
                $scope.PHI_documents.map(function(r){
                  r.selected = false
                })
                $scope.periods = window.app.periods.map(function(r){
                  r.selected = r.delta_month == -1
                  return r
                })
                break;
              case "REFORMAT":
                $scope.PHI_documents = window.app.PHI_documents.filter(function(d){
                  d.selected = false
                  return d.change_type != 'AGGREGATE'
                    && d.change_type != 'INSERT'
                })
                break;
              case "INSERT":
                $scope.PHI_documents = window.app.PHI_documents.filter(function(d){
                  d.selected = false
                  return d.change_type != 'AGGREGATE'
                    && d.change_type != 'INSERT'
                })
                break;
              case "AGGREGATE":
                $scope.PHI_documents = window.app.PHI_documents.filter(function(d){
                  d.selected = false
                  return d.change_type != 'AGGREGATE'
                })
              case "EXPORT":
                $scope.PHI_documents = window.app.PHI_documents.filter(function(d){
                  d.selected = false
                  return d.change_type == 'CREATE'
                })
              case "DESTROY":
                break;
            }
       }
       $scope.changeSelection = function(arr,item){
         $scope.clearSelection(arr)
         item.selected = true
        //  if(!$scope.config.selectMultipleDocuments){
        //    $scope.PHI_documents.map(function(r){
        //      r.selected = (r == item)
        //    })
        //  }
        //  if(!$scope.config.selectMultipleClients){
        //    $scope.clients.map(function(r){
        //      r.selected = (r == item)
        //    })
        //  }
        //  if(!$scope.config.selectMultipleClients){
        //    $scope.clients.map(function(r){
        //      r.selected = (r == item)
        //    })
        //  }
       }
       $scope.clearSelection = function(arr){
         if(typeof $scope[arr] != 'object') return
         $scope[arr].map(function(r){
           r.selected = false
         })
       }
       $scope.load = function(){
         $scope.clients = []
         $scope.processors = []
         $scope.loadClients("client")
         $scope.loadClients("processor")
       }
       $scope.$on('changeUtility', function () {
          $rootScope.showUtility = false
          $scope.clientIsLoaded = false
          $scope.utility = $rootScope.utility
          $scope.load()

       });
       $scope.loadDocuments = function(){
         var data = {
           client_type:$scope.utility.type,
           client_name:newClient.toUpperCase()
         }
         RxEService.genericGet('get-phi-documents',data).then(function(msg){
           consol.elog(msg)
         })
       }
       $scope.loadClients = function(clientType){
         RxEService.getClients(clientType).then(function(clients){
           var filterContracted = function(r){return r.client_status == 'Contracted'}
           if(clients){
             if(clientType == 'processor'){
               $scope.processors = clients.filter(filterContracted)
             }else if(clientType == 'client'){
               $scope.clients = clients.filter(filterContracted)
             }

           }
         })
       }
      //  $scope.clients = RxEService.getClients($scope.utility)

       $scope.formatDate = RxEService.formatDate
       $scope.devel = function(){
         console.log($scope)
         $mdSidenav('left').toggle();
       }
       $scope.uploadFile = function(){
          var file = $scope.myFile; // $scope.myFile is set buy the directive
          console.log('file is ' + $scope.myFile.name );
          var uploadUrl = "/fileUpload";
          fileUpload.uploadFileToUrl(file, uploadUrl);
      };
       $scope.go = function(){
         switch($scope.method.name){
           case "RECEIVE":

            break;

         }
       }
       $scope.load()
    }]

    return {
      restrict: 'EA', //Default in 1.3+
      scope: {
          datasource: '=',
          add: '&',
          utility:"=utility"
      },
      controller: controller,
      template   : require('./claims.html'),
  };
 }
})();
