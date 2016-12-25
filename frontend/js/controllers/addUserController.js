angular
    .module('pollsApp')
    .controller('addUserController', addUserController);

addUserController.$inject = ['usersService', '$state', 'USER_ROLES', '$stateParams', 'alertService'];

function addUserController(usersService, $state, USER_ROLES, $stateParams, alertService) {
    var vm = this;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    vm.user = {};
    vm.USER_ROLES = USER_ROLES;

    var loadUser = function (id) {
        usersService.get(id)
            .then(function (user) {
                vm.user = user;
                vm.orig = angular.copy(vm.user);
            });
    };

    vm.saveUser = function (id) {
        if (id) {
            usersService.update(id, vm.user)
                .then(function () {
                    $state.go('users');
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
                });
        } else {
            usersService.add(vm.user)
                .then(function () {
                    $state.go('users');
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
                });
        }

    };

    vm.resetForm = function () {
        if (vm.user._id) {
            vm.user = angular.copy(vm.orig);
            vm.addUserForm.$setPristine();
        } else {
            vm.user = {};
            vm.addUserForm.$setPristine();
        }
    };

    if ($stateParams.id) {
        loadUser($stateParams.id);
    }

}
