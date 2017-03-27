(function(){

  angular
       .module('main')
       .directive('processorsView',['RxEService',processorsController])

 function processorsController(RxEService){
     var controller = ['$scope',function ($scope) {
        //  console.log(RxEService.config)
        var self = this
        self.routine = {
          name:'Manage Processors',
          icon:'business',
          description:'manage Processor'
        }
        console.log(RxEService.routines)
    }]

    return {
      restrict: 'EA', //Default in 1.3+
      scope: {
          datasource: '=',
          add: '&',
      },
      controller: controller,
      templateUrl: 'src/main/views/processors.html'
  };
 }
})();
