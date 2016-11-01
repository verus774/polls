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

    $urlRouterProvider.otherwise('/');
});
