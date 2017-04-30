import moment from 'moment'
(function(){
  'use strict';

  angular.module('main').service('RxEService', ['$q','$rootScope','$http','$mdToast','$mdDialog','$timeout','Upload', RxEService]);

  function RxEService($q,$rootScope,$http,$mdToast,$mdDialog,$timeout,Upload){
    window.app = {
      engine:'http://localhost/rxe-api/operations-manager-engine.php',
      production:false,
      user:{user_id:'NWEAVER'},
      clients:[],
      periods:[],
      rxebate:{},
      config:{},
      PHI_documents:[]
    }
    var mimicAjax = function(deferred){
      $timeout( function(){
        deferred.resolve([])
      },1000)
      return deferred.promise
    }
    var methods = [{
        name:'RECEIVE',
        label:'Download FTP',
        icon:'file_download',
        hidden:true
      },{
        name:'REFORMAT',
        label:'Reformat File',
        icon:'spellcheck'
      },{
        name:'INSERT',
        label:'Import Claims to RxEBASE',
        icon:'archive'
      },{
        name:'AGGREGATE',
        label:'Aggregate/Format for Processor',
        icon:'call_merge'
      },{
        name:'CREATE',
        label:'',
        icon:'share',
        hidden:true
      },{
        name:'EXPORT',
        label:'Export to Processor',
        icon:'send'
      },{
        name:'DESTROY',
        label:'Destroy PHI',
        icon:'delete_forever'
    }]
    var utilities = [{
          label:'Processors',
          type:'processor',
          icon:'business',
          identifier:'Processor ID',
          description:'manage Processor',
          call:'get-processors',
          tabs:['Contact','History','Financial','Documents','Scripting']
        },{
          label: 'Clients',
          type:'client',
          icon: 'contacts',
          identifier:'Client ID',
          call:'get-clients',
          description: 'manage clients',
          tabs:['Contact','History','Financial','Documents','Scripting']
        },{
          label: 'Employees',
          type:'employee',
          icon: 'people',
          identifier:'Employee ID',
          call:'get-employees',
          description: 'Manage Employees',
          tabs:['Contact','Financial','Documents']
        },{
          label: 'Claims',
          type:'claims',
          icon: 'timeline',
          description: 'Process Claims',
          tabs:[]
      }];
    window.app.methods = methods
    window.app.utilities = utilities
    var genericGet = function(cmd,data){
      var deferred = $q.defer()
      if(!window.app.production) return mimicAjax(deferred)
      var params = []
      if(data){
        for (key in data){
          params.push(key + "=" + data[key])
        }
      }
      var queryString = "?cmd=" + cmd + params.join("&")
      $http({
           method : "GET",
           url : window.app.engine + queryString
       }).then(function mySucces(msg) {
         var response = decodeMessage(msg.data)
         if(response.success){
           deferred.resolve(response.data)
         }else{

         }
       }, function myError(msg) {
            deferred.reject( msg)
       });
      return deferred.promise
    }
    genericGet("get-quarters").then(function(msg){
      window.app.periods = msg||[]
    },function(msg){console.log("ERROR in get-quarters",msg)})
    genericGet("get-PHI-documents").then(function(msg){
      if(msg){
        var ixs = app.methods.map(function(r){return r.name})
        window.app.PHI_documents = msg.map(function(r){
          var loc = ixs.indexOf(r.change_type)

          r.icon = window.app.methods[loc].icon
        })
      }
      window.app.PHI_documents = msg||[]
    },function(msg){console.log("ERROR in get-PHI-documents",msg)})

    var decodeMessage = function(text){
      try{
        return JSON.parse(decodeURIComponent(text))
      }catch(err){
        return false
      }
    }
    var filterClientType = function(type){
      return window.app.clients.filter(function(c){
        return c.client_type == type
      })
    }

    return {
      utilities:utilities,
      getClients: function(clientType){
        var deferred = $q.defer()
        if(!window.app.production) return mimicAjax(deferred)
        if(window.app.clients.length > 0){
            var rtn = filterClientType(clientType)
            deferred.resolve(rtn)
        }else{
          $http({
               method : "GET",
               url : window.app.engine + "?cmd=get-clients"
           }).then(function mySucces(msg) {
             var response = decodeMessage(msg.data)
             window.app.clients = response.data
             var rtn = filterClientType(clientType)
             deferred.resolve(rtn)
           }, function myError(msg) {
                deferred.reject( msg)
           });
        }
        return deferred.promise
      },
      getUtilityInfo: function(id,utility){
        var deferred = $q.defer()
        if(!window.app.production) return mimicAjax(deferred)
          $http({
               method : "GET",
               url : window.app.engine + "?cmd=get-client-info&id="+id
           }).then(function mySucces(msg) {
             var response = decodeMessage(msg.data)
                if(response.success){
                  deferred.resolve(response.data)
                }else{
                  deferred.reject(response)
                }
           }, function myError(msg) {
              deferred.reject(msg.data)
           });
          return deferred.promise
      },
      prepareCleanObject: function(o,item){
        // {client_info:{},parameters:{},activity:[],documents:[]}
        switch(item){
          case "client_info":
            var obj = {}
            for(var prop in o){
                obj[prop] = {}
                obj[prop]["value"] = o[prop]
                obj[prop]["original-value"] = o[prop]
              }
            break;
          case "documents":
            var obj = o.map(function(r){
              r["original-status"] = r.document_status
              r["original-description"] = r.document_description
            })
          default: return o;
        }
        return obj
      },
      prepareSaveObject: function(o){
        var rtn = []
        var clientId = o.client_info.client_id.value
        var bSaveClient = false
        for(var prop in o.client_info){
          var newVal = o["client_info"][prop]["value"]
          var origVal = o["client_info"][prop]["original-value"]
          if(typeof newVal != 'undefined' && origVal != newVal) bSaveClient = true
        }

        if(bSaveClient){
          // var st = (o.client_info.client_status.value == true)?"Active":"Inactive"
          rtn.push({
            item_id:clientId,
            item_type:'client_info',
            item_name:'client_info',
            item_val:{
              client_name: o.client_info.client_name.value,
              client_status:o.client_info.client_status.value
            },
            client_id:clientId,
            command:'update'
          })
          window.app.clients = []
        }

        for(var prop in o["parameters"]){
          var newVal = o["parameters"][prop]["value"]
          var origVal = o["parameters"][prop]["original-value"]
          var objId = (typeof o["parameters"][prop]["id"] == 'undefined')?null:o["parameters"][prop]["id"]
          var cmd = (objId == null)?"insert":"update"
          if(typeof newVal != 'undefined' && origVal != newVal){
            rtn.push({
              item_id:objId,
              item_type:'parameters',
              item_name:prop,
              item_val:newVal,
              client_id:clientId,
              command:cmd
            })
          }
        }

        o["documents"].map(function(doc){
          var newDoc = doc["document_description"] + doc["document_status"]
          var origDoc = doc["original-description"] + doc["original-status"]
          var docId = (typeof doc.document_id == 'undefined')?null:doc.document_id
          var cmd = (typeof doc.document_id == 'undefined')?"insert":"update"
          cmd = (typeof doc.deleted == 'undefined')?cmd:"delete"
          if(typeof newDoc != 'undefined' && origDoc != newDoc){
            rtn.push({
              item_type:'document',
              client_id:clientId,
              item_name:doc.document_name,
              item_val:{
                document_id:docId,
                document_name:doc.document_name,
                document_url:doc.document_url,
                document_description:doc.document_description,
                document_status:doc.document_status
              },
              command:cmd
            })
          }

        })

        return rtn
      },
      getUnitedStates: function(){
        return getUnitedStates()
      },
      getEntityTypes: function(){
        return [{type:'Contractor'},{type:'Pharmacy'},{type:'Specialty'}]
      },
      hideSave:function(){
        $mdToast.hide()
      },
      showSave: function() {
        var deferred = $q.defer()
        $rootScope.showingSave = true
        var toast = $mdToast.simple()
          .textContent('You have unsaved changes')
          .action('Click to Save')
          .highlightAction(true)
          .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
          .position('top right')
          .hideDelay(200000);

        $mdToast.show(toast).then(function(response) {
          $rootScope.showingSave = false
          if ( response == 'ok' ) {
            deferred.resolve()
          }
        });
        return deferred.promise
      },
      saveChanges:function(saveObj,utility){
        var data = {}
        data.queue = saveObj
        data.user_id = window.app.user.user_id
        data = "data=" + encodeURIComponent(JSON.stringify(data))
        var deferred = $q.defer()
        if(!window.app.production) return mimicAjax(deferred)
        $http({
             method : "POST",
             url : window.app.engine + "?cmd=save-changes",
             data : data,
             headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
         }).then(function mySucces(msg) {
            var response = decodeMessage(msg.data)
            deferred.resolve(response.data)
         }, function myError(msg) {
            deferred.resolve(msg.data)
         });

        return deferred.promise
      },
      uploadFile: function(file,invalidFile){
        var deferred = $q.defer()
        if(!window.app.production) return mimicAjax(deferred)
          if(file){
            Upload.upload({
                url: window.app.engine + "?cmd=upload-file",
                data: {file: file, 'targetPath': 'test'}
            }).then(function (msg) {
              var response = decodeMessage(msg.data)
              if(response.success){
                deferred.resolve(response.data)
              }else{
                deferred.reject(response.data)
              }
                // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (msg) {
                deferred.reject(msg)
            }
              // ,function (evt) {
              //   var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              //   console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
              // }
            )
          }
          return deferred.promise
      },
      genericPost: function(cmd,data){
        data.user_id = window.app.user.user_id
        var deferred = $q.defer()
        if(!window.app.production) return mimicAjax(deferred)
        data = "data=" + encodeURIComponent(JSON.stringify(data))
        $http({
             method : "POST",
             url : window.app.engine + "?cmd=" + cmd,
             data : data,
             headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
         }).then(function mySucces(msg) {
           var response = decodeMessage(msg.data)
           deferred.resolve(response.data)
         }, function myError(msg) {
            deferred.resolve(msg.data)
         });
         return deferred.promise
      },
      genericGet:genericGet,
      genericAlert: function(ev,message,title) {
         $mdDialog.show(
           $mdDialog.alert()
             .parent(angular.element(document.body))
             .clickOutsideToClose(true)
             .title(title)
             .textContent(message)
             .ariaLabel(title)
             .ok('Okay')
             .targetEvent(ev)
         );
       },
      genericConfim: function(ev,message,title) {
        var deferred = $q.defer()
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
          .title(title)
          .textContent(message)
          .ariaLabel(title)
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
          deferred.resolve(true)
        }, function() {
          // deferred.resolve(false)
        });
        return deferred.promise
      },
      genericInput: function(ev,message,title) {
        var deferred = $q.defer()
        // Appending dialog to document.body to cover sidenav in docs app
        var input = $mdDialog.prompt()
          .title(title)
          .placeholder(title)
          .textContent(message)
          .ariaLabel(title)
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');

        $mdDialog.show(input).then(function(response) {
          deferred.resolve(response)
        }, function() {
          // deferred.resolve(false)
        });
        return deferred.promise
      },
      formatDate: function(date){
        if(date.date){
          return moment(date.date).format("YYYY-MM-DD")
        }else{
          return moment(date).format("YYYY-MM-DD")
        }

      }
    }
  }

})();
