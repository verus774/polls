(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('navigationController', navigationController);

    navigationController.$inject = ['$state', 'authService'];

    function navigationController($state, authService) {
        var vm = this;

        vm.authService = authService;

        vm.logout = function () {
            authService.logout();
            $state.go('main');
        }
    }

})();
