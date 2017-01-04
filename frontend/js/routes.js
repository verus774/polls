angular.module('pollsApp').config(function ($stateProvider, $urlRouterProvider) {
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
});
