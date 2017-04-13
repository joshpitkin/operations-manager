(function(){
  'use strict';
  angular.module('main').service('RxEService', ['$q','$rootScope','$http','$mdToast','$mdDialog','$timeout','Upload', RxEService]);

  function RxEService($q,$rootScope,$http,$mdToast,$mdDialog,$timeout,Upload){
    window.app = {
      engine:'http://localhost/rxe-api/operations-manager-engine.php',
      user:{user_id:'NWEAVER'},
      clients:[],
      processors:[],
      employees:[],
      rxebate:{},
      config:{}
    }
    var utilities = [{
        name:'Processors',
        icon:'business',
        identifier:'Processor ID',
        description:'manage Processor',
        call:'get-processors',
        tabs:['Contact','History','Financial','Documents','Scripting']
      },
      {
        name: 'Clients',
        icon: 'contacts',
        identifier:'Client ID',
        call:'get-clients',
        description: 'manage clients',
        tabs:['Contact','History','Financial','Documents','Scripting']
      },
      {
        name: 'Employees',
        icon: 'people',
        identifier:'Employee ID',
        call:'get-employees',
        description: 'Manage Employees',
        tabs:['Contact','Financial','Documents']
      },
      {
        name: 'Claims',
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

    return {
      utilities:utilities,
      getClients: function(utility){
        console.log(utility.call)
        var deferred = $q.defer()
          $http({
               method : "GET",
               url : window.app.engine + "?cmd=" + utility.call
           }).then(function mySucces(response) {
                deferred.resolve( response.data.data)
           }, function myError(response) {
                deferred.reject( response)
           });
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
        /*
          utilities: (processor,client,employee)
          id: (processor_id,client_id,employee_id)
        */
        console.log(utility)
        var deferred = $q.defer()
        $timeout( function(){
            deferred.resolve({
                client_info:{
                  client_id:1005,
                  client_name:'RxETEST',
                  client_status:'Active',
                  client_insert_datetime:''
                },
                parameters:{
                  entity_name:'test',
                  entity_type:'test',
                  entity_address:'123 road',
                  entity_city:'houston',
                  entity_state:'tx',
                  entity_zip:'77777',
                  entity_EIN:'123-4123098',
                  bank_name:'wells fargo',
                  bank_address:'123 road street',
                  bank_city:'sugar land',
                  bank_state:'tx',
                  bank_zip:'88888',
                  bank_account_holder:'mdsccripts',
                  bank_account_number:'123123132',
                  bank_routing_number_direct_deposit:'12312',
                  bank_routing_number_wire:'12312',
                  contact_name:'frank',
                  contact_position:'president',
                  contact_email:'frank@gmail',
                  contact_phone:'123-123-1234',
                  format_instructions:'testing <b>TEsTING</b> testing',
                },
                documents:[],
                rebate_history:[
                  {
                    name: 'Point 1',
                    y: 24,
                  }, {
                      name: 'Point 2',
                      y: 15
                  }, {
                      name: 'Point 3',
                      y: 18
                  }
                ],
                activity:[
                  {
                      client_id:1005,
                      change_description: "teset change",
                      change_user: "NWEAVER",
                      change_datetime: "3/12/85"
                    },{client_id:1005,
                      change_description: "teset change",
                      change_user: "NWEAVER",
                      change_datetime: "3/12/85"
                    },{client_id:1005,
                      change_description: "teset change",
                      change_user: "NWEAVER",
                      change_datetime: "3/12/85"
                    }
                  ]
            })
        }, 1000 );

          // $http({
          //      method : "GET",
          //      url : window.app.engine + "?cmd=get-client-info&client_id="+client_id
          //  }).then(function mySucces(response) {
          //       return window.app.clients
          //  }, function myError(response) {
          //     return {};
          //  });
          return deferred.promise
      },
      prepareCleanObject: function(o){
        var obj = {}
          for(var prop in o){
              obj[prop] = {}
              obj[prop]["value"] = o[prop]
              obj[prop]["original-value"] = o[prop]
            }
        return obj
      },
      prepareDirtyObject: function(o){
        var obj  = {
          client_info:{},
          parameters:{}
        }
        var rtn = []
        for(var item in obj){
          for(var prop in o[item]){
            var newVal = o[item][prop]["value"]
            var val = o[item][prop]["original-value"]
            var cmd = (typeof val == 'undefined')?"insert":"update"
            if(typeof newVal != 'undefined' && val != newVal){
              rtn.push({
                item_type:item,
                item_name:prop,
                item_val:newVal,
                command:cmd
              })
            }
          }
        }
        return rtn
      },
      getUnitedStates: function(){
        return getUnitedStates()
      },
      getEntityTypes: function(){
        return [{type:'A'},{type:'B'},{type:'C'},{type:'D'}]
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
      saveChanges:function(dirtyList,utility){
        var deferred = $q.defer()
        $http({
             method : "POST",
             url : window.app.engine + "?cmd=" + cmd,
             data : data,
             headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
         }).then(function mySucces(msg) {
            deferred.resolve(msg.data.data)
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
                if(msg.data.success){
                   deferred.resolve(msg.data.data)
                }else{
                  deferred.reject(msg.data)
                }
                // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (msg) {
                deferred.reject(msg.data)
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
        var deferred = $q.defer()
        data = "data=" + JSON.stringify(data)

        $http({
             method : "POST",
             url : window.app.engine + "?cmd=" + cmd,
             data : data,
             headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
         }).then(function mySucces(msg) {
            deferred.resolve(msg.data.data)
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
      }
    }
  }

})();
