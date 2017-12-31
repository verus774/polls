(function () {
    'use strict';

    angular
        .module('pollsApp')
        .config(routes);

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routes($stateProvider, $urlRouterProvider) {
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

        $stateProvider.state('categories', {
            url: '/categories',
            templateUrl: '../templates/categories.html',
            controller: 'categoriesController',
            controllerAs: 'vm',
            data: {restricted: true}
        });

        $stateProvider.state('polls', {
            url: '/polls',
            templateUrl: '../templates/polls.html',
            controller: 'pollsController',
            controllerAs: 'vm',
            data: {restricted: true}
        });

        $stateProvider.state('pollsDetail', {
            url: '/polls/:id',
            templateUrl: '../templates/pollsDetail.html',
            controller: 'pollsDetailController',
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

        $stateProvider.state('resultsDetail', {
            url: '/results/:id',
            templateUrl: '../templates/resultsDetail.html',
            controller: 'resultsDetailController',
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

        $stateProvider.state('addCategory', {
            url: '/add-category',
            templateUrl: '../templates/addCategory.html',
            controller: 'addCategoryController',
            controllerAs: 'vm',
            data: {restricted: true}
        });

        $stateProvider.state('editCategory', {
            url: '/edit-category/:id',
            templateUrl: '../templates/addCategory.html',
            controller: 'addCategoryController',
            controllerAs: 'vm',
            data: {restricted: true}
        });

        $stateProvider.state('student', {
            url: '/rooms/:id',
            templateUrl: '../templates/student.html',
            controller: 'studentController',
            controllerAs: 'vm'
        });

        $urlRouterProvider.otherwise('/');
    }

})();
