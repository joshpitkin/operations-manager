(function(){
  'use strict';
  angular.module('main').service('RxEService', ['$q','$http', RxEService]);

  function RxEService($q,$http){
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
      engine:'http://localhost/rxe-api/operations-manager-engine.php'
      ,user:{}
      ,config:{}
      ,clients:[]
      ,processors:[]
      ,employees:[]
      ,rxebate:{}
      ,routines:routines
      ,getClients: function(){
        if(this.clients.length == 0){
          $http({
               method : "GET",
               url : this.engine + "?cmd=get-clients"
           }).then(function mySucces(response) {
                RxEService.clients = response.data.data //(response.data.success)?  buildConfig(response.data.data):{}
                return RxEService.clients
           }, function myError(response) {
              RxEService.clients = []
              return [];
           });
        }else{
          return this.clients
        }
      },getConfig:function(){
        if(this.config == {}){
          $http({
               method : "GET",
               url : this.engine + "?cmd=get-config"
           }).then(function mySucces(response) {
                RxEService.config = response //(response.data.success)?  buildConfig(response.data.data):{}
               return RxEService.config
           }, function myError(response) {
               RxEService.config = {}
               return {};
           })
        }else{
          return this.config
        }
      }
    };
  }

})();
