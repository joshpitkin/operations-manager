(function(){

  angular
       .module('main',['angularTrix','ngFileUpload'])
       .controller('RxEController', ['$scope','$rootScope',
          'RxEService', 'Upload', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log',
          RxEController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function RxEController( $scope,$rootScope,RxEService, Upload, $mdSidenav, $mdBottomSheet, $timeout, $log ,$mdToast) {
    var self = this
    $rootScope.showUtility = false
    $rootScope.loading = false
    self.utilities     = RxEService.utilities
    self.selectedUtility     = null
    self.toggleUtility   = function( ut ) {
      $rootScope.utility = ut
      $rootScope.$broadcast('changeUtility');
      // $rootScope.showUtility = (ut.name == 'Claims')

      self.selectedUtility = angular.isNumber(ut) ? self.utilities[rt] : ut;
    }
    self.toggleList   = function(){
      $mdSidenav('left').toggle();
    }

    // self.clients = RxEService.getClients()

    // self.makeContact  = makeContact
    // function makeContact(selectedUser) {
    //     $mdBottomSheet.show({
    //       controllerAs  : "vm",
    //       templateUrl   : './src/main/views/contactSheet.html',
    //       controller    : [ '$mdBottomSheet', ContactSheetController],
    //       parent        : angular.element(document.getElementById('content'))
    //     }).then(function(clickedItem) {
    //       $log.debug( clickedItem.name + ' clicked!');
    //     });

        /**
         * User ContactSheet controller
         */
        // function ContactSheetController( $mdBottomSheet ) {
        //   this.user = selectedUser;
        //   this.items = [
        //     { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
        //     { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
        //     { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
        //     { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
        //   ];
        //   this.contactUser = function(action) {
        //     // The actually contact process has not been implemented...
        //     // so just hide the bottomSheet
        //     console.log(RxEService.config)
        //     $mdBottomSheet.hide(action);
        //   };
        // }
    // }

  }
})();
