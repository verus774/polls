angular
    .module('pollsApp')
    .controller('profileController', profileController);

profileController.$inject = ['authService', 'alertService'];

function profileController(authService, alertService) {
    var vm = this;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

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
                    alertService.add('success', 'Profile updated', alertTimeout);
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
                });
        }
    };
}
