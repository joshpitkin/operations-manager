(function(){
  'use strict';
  angular.module('main').service('RxEService', ['$q','$http', RxEService]);

  function RxEService($q,$http){
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
        description:'manage Processor',
        tabs:['Contact','History','Financial','Documents','Scripting']
      },
      {
        name: 'Clients',
        icon: 'contacts',
        description: 'manage clients',
        tabs:['Contact','History','Financial','Documents','Scripting']
      },
      {
        name: 'Employees',
        icon: 'people',
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

    // Promise-based API
    return {
      utilities:utilities,
      getClients: function(){
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
      },
      getConfig:function(){
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
      },
      getUtilityInfo: function(id,utility){
        /*
          utilities: (processor,client,employee)
          id: (processor_id,client_id,employee_id)
        */
          return {
              client_id:'RxETEST',
              active:true,
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
              format_instructions:'',
              documents:[{
                  title:'NDA',
                  date:'3/12/85',
                  location:'http://www.google.com'
                },{
                  title:'BAA',
                  date:'3/12/85',
                  location:'http://www.google.com'
                },{
                  title:'Service Aggreement',
                  date:null,
                  location:null
                },{
                  title:'W9',
                  date:null,
                  location:null
                }],
              rebate_history:[{
                  name: 'Point 1',
                  y: 24,
                }, {
                    name: 'Point 2',
                    y: 15
                }, {
                    name: 'Point 3',
                    y: 18
                }],
              activity:[{
                    client_id:'RxETest',
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
      },
      getUnitedStates: function(){
        return getUnitedStates()
      },
      getEntityTypes: function(){
        return [{type:'A'},{type:'B'},{type:'C'},{type:'D'}]
      }
    };
  }

})();
