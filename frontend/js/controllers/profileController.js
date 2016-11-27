angular
    .module('pollsApp')
    .controller('profileController', profileController);

profileController.$inject = ['authService', 'usersService', '$state'];

function profileController(authService, usersService, $state) {
    var vm = this;

    vm.user = authService.getUser();
    vm.orig = angular.copy(vm.user);

    vm.resetForm = function () {
        vm.user = angular.copy(vm.orig);
        vm.profileForm.$setPristine();
    };

    vm.updateUser = function () {
        if (vm.user) {
            usersService.update(vm.user)
                .then(function () {
                    $state.reload();
                });
        }
    };
}
