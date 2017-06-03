(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('signupController', signupController);

    signupController.$inject = ['$state', 'authService', 'Notification', '$filter'];

    function signupController($state, authService, Notification, $filter) {
        var vm = this;
        var $translate = $filter('translate');

        vm.signup = function () {
            authService.signup(vm.username, vm.name, vm.password)
                .then(function () {
                    $state.go('polls');
                })
                .catch(function () {
                    Notification.error($translate('SIGNUP_FAIL'));
                    $state.reload();
                });

        };
    }

})();
