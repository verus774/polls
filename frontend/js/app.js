angular.module('pollsApp', [
    'ui.router',
    'angular-jwt',
    'angular.filter',
    'btford.socket-io'
]);

angular.module('pollsApp').constant('config', {
    storageType: 'localStorage',
    apiEndpoint: 'api/v1',
    authEndpoint: 'auth'
});

angular.module('pollsApp').config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
        templateUrl: '../templates/signup.html'
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
        controller: 'editPollController',
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
