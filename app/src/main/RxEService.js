(function(){
  'use strict';
  angular.module('main').service('RxEService', ['$q','$http', RxEService]);

  function RxEService($q,$http){
    window.app = {
      engine:'http://localhost/rxe-api/operations-manager-engine.php',
      user:{},
      clients:[],
      processors:[],
      employees:[],
      rxebate:{},
      config:{}
    }
    var routines = [{
        name:'Manage Processors',
        icon:'business',
        description:'manage Processor'
      },
      {
        name: 'Manage Clients',
        icon: 'contacts',
        description: 'manage clients'
      },
      {
        name: 'Manage Employees',
        icon: 'people',
        description: 'Manage Employees'
      },
      {
        name: 'Process Claims',
        icon: 'timeline',
        description: 'Process Claims'
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

    // Promise-based API
    return {
      routines:routines
      ,getClients: function(){
        if(window.app.clients.length == 0){
          $http({
               method : "GET",
               url : window.app.engine + "?cmd=get-clients"
           }).then(function mySucces(response) {
                window.app.clients = response.data.data //(response.data.success)?  buildConfig(response.data.data):{}
                return window.app.clients
           }, function myError(response) {
              window.app.clients = []
              return [];
           });
        }else{
          return window.app.clients
        }
      },getConfig:function(){
        if(window.app.config == {}){
          $http({
               method : "GET",
               url : this.engine + "?cmd=get-config"
           }).then(function mySucces(response) {
                window.app.config = response //(response.data.success)?  buildConfig(response.data.data):{}
               return window.app.config
           }, function myError(response) {
               window.app.config = {}
               return {};
           })
        }else{
          return window.app.config
        }
      },getClientInfo: function(client_id){
          return {
            rebate_history:[
              ['ideas1', 1],
              ['ideas2', 8],
              ['ideas3', 5]
            ],
            activity:[
              {client_id:'RxETest',
                change_description: "teset change",
                change_user: "NWEAVER",
                change_datetime: "3/12/85"
              },{client_id:'RxETest',
                change_description: "teset change",
                change_user: "NWEAVER",
                change_datetime: "3/12/85"
              },{client_id:'RxETest',
                change_description: "teset change",
                change_user: "NWEAVER",
                change_datetime: "3/12/85"
              }
            ]
          }
          // $http({
          //      method : "GET",
          //      url : window.app.engine + "?cmd=get-client-info&client_id="+client_id
          //  }).then(function mySucces(response) {
          //       return window.app.clients
          //  }, function myError(response) {
          //     return {};
          //  });
      }
    };
  }

})();
