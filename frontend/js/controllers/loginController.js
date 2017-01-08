(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('loginController', loginController);

    loginController.$inject = ['$state', 'authService', 'Notification'];

    function loginController($state, authService, Notification) {
        var vm = this;

        vm.login = function () {
            authService.login(vm.username, vm.password)
                .then(function () {
                    $state.go('polls');
                })
                .catch(function () {
                    Notification.error('Authorization fail');
                    $state.reload();
                });
        };

    }

})();
