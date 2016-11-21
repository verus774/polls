angular.module('pollsApp', [
    'ui.router',
    'angular-jwt',
    'angular.filter',
    'btford.socket-io',
    'googlechart',
    'angular-loading-bar',
    'ui.bootstrap'
]);

angular.module('pollsApp').constant('config', {
    storageType: 'localStorage',
    apiEndpoint: 'api/v1',
    authEndpoint: 'auth'
});

angular.module('pollsApp').config(function ($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;

    $stateProvider.state('main', {
        url: '/',
        templateUrl: '../templates/main.html',
        controller: 'mainController',
        controllerAs: 'vm'
    });

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '../templates/login.html',
        controller: 'loginController',
        controllerAs: 'vm'
    });

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: '../templates/signup.html',
        controller: 'signupController',
        controllerAs: 'vm'
    });

    $stateProvider.state('me', {
        url: '/me',
        templateUrl: '../templates/me.html'
    });

    $stateProvider.state('manage', {
        url: '/manage',
        templateUrl: '../templates/manage.html',
        controller: 'manageController',
        controllerAs: 'vm'
    });

    $stateProvider.state('addPoll', {
        url: '/add-poll',
        templateUrl: '../templates/addPoll.html',
        controller: 'addPollController',
        controllerAs: 'vm'
    });

    $stateProvider.state('editPoll', {
        url: '/edit-poll/:id',
        templateUrl: '../templates/addPoll.html',
        controller: 'addPollController',
        controllerAs: 'vm'
    });

    $stateProvider.state('student', {
        url: '/student',
        templateUrl: '../templates/student.html',
        controller: 'studentController',
        controllerAs: 'vm'
    });

    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('interceptorService');

});

angular.module('pollsApp').filter('startFrom', function () {
    return function (input, start) {
        if (!input || !input.length) {
            return;
        }
        start = parseInt(start, 10);
        return input.slice(start);
    }
});