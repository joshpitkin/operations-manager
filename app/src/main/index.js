import angular from 'angular'
import 'angular-material'
import 'angular-messages'
import 'angular-animate'
import 'angular-aria'
import 'angular-material-icons'
import 'angular-trix'
import 'ng-file-upload'

import './main'
import './RxEController'
import './RxEService'
import './views/claims'
import './views/hc-pie'
import '../lib/united_states.js'

import '../../assets/app.css'
import '../../assets/rxe.css'
import '../../../node_modules/angular-material/angular-material.min.css'
import avatars from '../../assets/svg/avatars.svg'
import menu from '../../assets/svg/menu.svg'
import share from '../../assets/svg/share.svg'
import google_plus from '../../assets/svg/google_plus.svg'
import hangouts from '../../assets/svg/hangouts.svg'
import twitter from '../../assets/svg/twitter.svg'
import phone from '../../assets/svg/phone.svg'

angular
  .module('RxEApp', ['ngMaterial', 'main','ngMdIcons'])
  .config(function($mdThemingProvider, $mdIconProvider){
    $mdIconProvider
      .defaultIconSet(avatars, 128)
      .icon("menu"       , menu        , 24)
      .icon("share"      , share       , 24)
      .icon("google_plus", google_plus , 512)
      .icon("hangouts"   , hangouts    , 512)
      .icon("twitter"    , twitter     , 512)
      .icon("phone"      , phone       , 512);

    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('red');
});
