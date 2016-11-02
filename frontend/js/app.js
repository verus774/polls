angular.module('pollsApp', [
    'ui.router'
]);

angular.module('pollsApp').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('main', {
        url: '/',
        templateUrl: '../templates/main.html',
        controller: 'mainController',
        controllerAs: 'vm'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '../templates/login.html'
    });

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: '../templates/signup.html'
    });

    $stateProvider.state('me', {
        url: '/me',
        templateUrl: '../templates/me.html'
    });

    $urlRouterProvider.otherwise('/');
});
