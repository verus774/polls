(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('loginController', loginController);

    loginController.$inject = ['$state', 'authService', 'Notification', '$filter'];

    function loginController($state, authService, Notification, $filter) {
        var vm = this;
        var $translate = $filter('translate');

        vm.login = function () {
            authService.login(vm.username, vm.password)
                .then(function () {
                    $state.go('polls');
                })
                .catch(function () {
                    Notification.error($translate('AUTHORIZATION_FAIL'));
                    $state.reload();
                });
        };

    }

})();
