import Highcharts from 'highcharts'
(function(){
  angular
       .module('main')
       .directive('hcPie', function () {
         return {
           restrict: 'E',
           replace: true,
           scope: {
             items: '='
           },
           template: '<div id="container" style="margin: 0 auto">not working</div>',
           link: function (scope, element, attrs) {
             //***  Chart Object
             var chartObj = {
               chart: {
                 renderTo: 'container',
                 plotBackgroundColor: null,
                 plotBorderWidth: null,
                 plotShadow: false,
               },
               title:{
                 text: ''
               },
               tooltip: {
                 pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                 percentageDecimals: 1
               },
               plotOptions: {
                 pie: {
                   allowPointSelect: true,
                   cursor: 'pointer',
                   dataLabels: {
                     enabled: true,
                     color: '#000000',
                     connectorColor: '#000000',
                     formatter: function () {
                       return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                     }
                   }
                 }
               },
               xAxis: {
                  categories: ['Jan', 'Feb', 'Mar']
              },
               series: [{
                 type: 'column',
                 name: 'Rebate History',
                 data: scope.items
               }]
             }
             // *** End Chart Object
             var chart = new Highcharts.Chart(chartObj);
             scope.$watch("items", function (newValue) {
               chart.series[0].setData(newValue, true);
             }, true);

           }
         }
       })
})();
