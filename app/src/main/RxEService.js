(function(){
  'use strict';
  angular.module('main').service('RxEService', ['$q','$rootScope','$http','$mdToast','$mdDialog','$timeout','Upload', RxEService]);

  function RxEService($q,$rootScope,$http,$mdToast,$mdDialog,$timeout,Upload){
    window.app = {
      engine:'http://localhost/rxe-api/operations-manager-engine.php',
      user:{user_id:'NWEAVER'},
      clients:[],
      rxebate:{},
      config:{}
    }
    var utilities = [{
        label:'Processors',
        type:'processor',
        icon:'business',
        identifier:'Processor ID',
        description:'manage Processor',
        call:'get-processors',
        tabs:['Contact','History','Financial','Documents','Scripting']
      },
      {
        label: 'Clients',
        type:'client',
        icon: 'contacts',
        identifier:'Client ID',
        call:'get-clients',
        description: 'manage clients',
        tabs:['Contact','History','Financial','Documents','Scripting']
      },
      {
        label: 'Employees',
        type:'employee',
        icon: 'people',
        identifier:'Employee ID',
        call:'get-employees',
        description: 'Manage Employees',
        tabs:['Contact','Financial','Documents']
      },
      {
        label: 'Claims',
        type:'claims',
        icon: 'timeline',
        description: 'Process Claims',
        tabs:[]
      }];

    // function treeify(root, allRows) {
    //      // search for all the rows that have a predecessor_key matching the root class_key
    //      var children = allRows.filter(function(e) {
    //        if(e.predecessor_keys !== null){
    //         return e.predecessor_keys.indexOf(root.item_id) !== -1;
    //       }else{
    //         return false
    //       }
    //      });
    //      // add those buckets to a children property of the root
    //      root.children = children;
    //      children.map(function(e, ix) {
    //         // recurse that function for all the children
    //         treeify(e, allRows);
    //      });
    //   }
    //
    // function buildConfig(obj) {
    //   var obj_map = obj.map(function(r){return r.item_id})
    //   var props = obj.filter(function(r){return r.item_type === 'item property'})
    //
    //   var root = obj.filter(function(r){return r.item_id == 1})[0]
    //   return treeify(root,obj)
    // };

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
      getClients: function(utility){
        var deferred = $q.defer()
        if(window.app.clients.length > 0){
            var rtn = filterClientType(utility.type)
            deferred.resolve(rtn)
        }else{
          $http({
               method : "GET",
               url : window.app.engine + "?cmd=get-clients"
           }).then(function mySucces(msg) {
             var response = decodeMessage(msg.data)
             window.app.clients = response.data
             var rtn = filterClientType(utility.type)
             deferred.resolve(rtn)
           }, function myError(msg) {
                deferred.reject( msg)
           });
        }
        return deferred.promise
      },
      // getConfig:function(){
      //   if(window.app.config == {}){
      //     $http({
      //          method : "GET",
      //          url : this.engine + "?cmd=get-config"
      //      }).then(function mySucces(response) {
      //           window.app.config = response //(response.data.success)?  buildConfig(response.data.data):{}
      //          return window.app.config
      //      }, function myError(response) {
      //          window.app.config = {}
      //          return {};
      //      })
      //   }else{
      //     return window.app.config
      //   }
      // },
      getUtilityInfo: function(id,utility){
        var deferred = $q.defer()
        // $timeout( function(){
        //     deferred.resolve({
        //         client_info:{
        //           client_type:'client',
        //           client_id:1005,
        //           client_name:'RxETEST',
        //           client_status:'Active',
        //           client_insert_datetime:''
        //         },
        //         parameters:{
        //           entity_name:'test',
        //           entity_type:'test',
        //           entity_address:'123 road',
        //           entity_city:'houston',
        //           entity_state:'tx',
        //           entity_zip:'77777',
        //           entity_EIN:'123-4123098',
        //           bank_name:'wells fargo',
        //           bank_address:'123 road street',
        //           bank_city:'sugar land',
        //           bank_state:'tx',
        //           bank_zip:'88888',
        //           bank_account_holder:'mdsccripts',
        //           bank_account_number:'123123132',
        //           bank_routing_number_direct_deposit:'12312',
        //           bank_routing_number_wire:'12312',
        //           contact_name:'frank',
        //           contact_position:'president',
        //           contact_email:'frank@gmail',
        //           contact_phone:'123-123-1234',
        //           format_instructions:'testing <b>TEsTING</b> testing',
        //         },
        //         documents:[],
        //         rebate_history:[
        //           {
        //             name: 'Point 1',
        //             y: 24,
        //           }, {
        //               name: 'Point 2',
        //               y: 15
        //           }, {
        //               name: 'Point 3',
        //               y: 18
        //           }
        //         ],
        //         activity:[
        //           {
        //               client_id:1005,
        //               activity_text: "teset change",
        //               activity_owner: "NWEAVER",
        //               activity_datetime: "3/12/85"
        //             },{client_id:1005,
        //               activity_text: "teset change",
        //               activity_owner: "NWEAVER",
        //               activity_datetime: "3/12/85"
        //             },{client_id:1005,
        //               activity_text: "teset change",
        //               activity_owner: "NWEAVER",
        //               activity_datetime: "3/12/85"
        //             }
        //           ]
        //     })
        // }, 1000 );

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
          var st = (o.client_info.client_status.value == true)?"Active":"Inactive"
          rtn.push({
            item_id:clientId,
            item_type:'client_info',
            item_name:'client_info',
            item_val:{
              client_name: o.client_info.client_name.value,
              client_status:st
            },
            client_id:clientId,
            command:'update'
          })
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
        return [{type:'A'},{type:'B'},{type:'C'},{type:'D'}]
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
      }
    }
  }

})();
