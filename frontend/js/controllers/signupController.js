(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('signupController', signupController);

    signupController.$inject = ['$state', 'authService', 'Notification'];

    function signupController($state, authService, Notification) {
        var vm = this;

        vm.signup = function () {
            authService.signup(vm.username, vm.name, vm.password)
                .then(function () {
                    $state.go('polls');
                })
                .catch(function () {
                    Notification.error('Signup fail');
                    $state.reload();
                });

        }
    }

})();
