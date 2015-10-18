'use strict';

var nusexamApp = angular.module('nusexamApp', [
    'ngRoute',
    'ui.bootstrap',
    'nusexamControllers',
    'nusexamServices'
]);

nusexamApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/static/html/index.html',
                controller: 'IndexCtrl'
            }).
            when('/cart', {
                templateUrl: '/static/html/cart.html',
                controller: 'CartCtrl'
            }).
            when('/module/:module', {
                templateUrl: '/static/html/module.html',
                controller: 'ModuleCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
