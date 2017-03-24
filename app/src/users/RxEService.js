(function(){
  'use strict';

  angular.module('clients')
         .service('RxEService', ['$q', RxEService]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function RxEService($q){
    var routines = [
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
        icon: 'directions',
        description: 'Process Claims'
      }
    ];

    // Promise-based API
    return {
      loadRoutines : function() {
        // Simulate async nature of real remote calls
        return $q.when(routines);
      }
    };
  }

})();
