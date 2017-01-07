angular
    .module('pollsApp')
    .controller('addUserController', addUserController);

addUserController.$inject = ['usersService', '$state', 'USER_ROLES', '$stateParams', 'Notification'];

function addUserController(usersService, $state, USER_ROLES, $stateParams, Notification) {
    var vm = this;

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
                    Notification.success('User updated');
                    $state.go('users');
                })
                .catch(function () {
                    Notification.error('Fail');
                });
        } else {
            usersService.add(vm.user)
                .then(function () {
                    Notification.success('User added');
                    $state.go('users');
                })
                .catch(function () {
                    Notification.error('Fail');
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
