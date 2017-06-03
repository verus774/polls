(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('profileController', profileController);

    profileController.$inject = ['authService', '$state', 'Notification', '$filter'];

    function profileController(authService, $state, Notification, $filter) {
        var vm = this;
        var $translate = $filter('translate');

        vm.user = authService.getUser();
        vm.orig = angular.copy(vm.user);

        vm.resetForm = function () {
            vm.user = angular.copy(vm.orig);
            vm.profileForm.$setPristine();
        };

        vm.updateUser = function () {
            if (vm.user) {
                authService.updateMe(vm.user)
                    .then(function () {
                        Notification.success($translate('PROFILE_UPDATED'));
                        $state.reload();
                    })
                    .catch(function () {
                        vm.message = $translate('ERROR');
                    });
            }
        };
    }

})();
