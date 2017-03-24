(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('profileController', profileController);

    profileController.$inject = ['authService', '$state', 'Notification'];

    function profileController(authService, $state, Notification) {
        var vm = this;

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
                        Notification.success('Profile updated');
                        $state.reload();
                    })
                    .catch(function () {
                        Notification.error('Fail');
                    });
            }
        };
    }

})();
