angular.module('pollsApp', [
    'ui.router',
    'angular-jwt',
    'angular.filter',
    'btford.socket-io',
    'googlechart',
    'angular-loading-bar',
    'ui.bootstrap'
]);

angular.module('pollsApp')
    .constant('config', {
        storageType: 'localStorage',
        apiEndpoint: 'api/v1',
        authEndpoint: 'auth'
    })
    .constant('USER_ROLES', {
        admin: 'admin',
        user: 'user'
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

    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: '../templates/profile.html',
        controller: 'profileController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('manage', {
        url: '/manage',
        templateUrl: '../templates/manage.html',
        controller: 'manageController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('results', {
        url: '/results',
        templateUrl: '../templates/results.html',
        controller: 'resultsController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('users', {
        url: '/users',
        templateUrl: '../templates/users.html',
        controller: 'usersController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('addUser', {
        url: '/add-user',
        templateUrl: '../templates/addUser.html',
        controller: 'addUserController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('editUser', {
        url: '/edit-user/:id',
        templateUrl: '../templates/addUser.html',
        controller: 'addUserController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('resultsDetail', {
        url: '/results/:id',
        templateUrl: '../templates/resultDetail.html',
        controller: 'resultDetailController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('addPoll', {
        url: '/add-poll',
        templateUrl: '../templates/addPoll.html',
        controller: 'addPollController',
        controllerAs: 'vm',
        data: {restricted: true}
    });

    $stateProvider.state('editPoll', {
        url: '/edit-poll/:id',
        templateUrl: '../templates/addPoll.html',
        controller: 'addPollController',
        controllerAs: 'vm',
        data: {restricted: true}
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

angular.module('pollsApp').run(function ($rootScope, authService, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.data && toState.data.restricted && !authService.isLoggedIn()) {
            event.preventDefault();
            $state.go('login');
        }
    });

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
