var app = angular.module('projeto.tempo',['ui.router',
            'ngCookies',
            'ui.bootstrap',
            'angularMoment',
            'chart.js',
          'projeto.tempo.home',
        'projeto.tempo.core',
      'projeto.tempo.spinnerbar']);

app.config(
  ['$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider,
    $urlRouterProvider) {
      $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'modules/home/views/home.html',
        controller: 'homeController',
        controllerAs:'vm',
        resolve: {
          listCity: function(homeService){
            return homeService.getListCity();
          },
          listState: function(homeService){
            return homeService.getListState();
          }
        }
      });
      $urlRouterProvider
      .otherwise('/home');
    }
  ]);

  app.init = function () {
    angular.element(document).ready(function () {
      angular.bootstrap(document, [namespace]);
    });
  };
