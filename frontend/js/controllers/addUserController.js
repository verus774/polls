(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('addUserController', addUserController);

    addUserController.$inject = ['crudService', '$state', '$window', 'USER_ROLES', '$stateParams', 'Notification'];

    function addUserController(crudService, $state, $window, USER_ROLES, $stateParams, Notification) {
        var vm = this;

        vm.user = {};
        vm.USER_ROLES = USER_ROLES;

        var loadUser = function (id) {
            crudService.get('users', id)
                .then(function (user) {
                    vm.user = user;
                    vm.orig = angular.copy(vm.user);
                })
                .catch(function (res) {
                    vm.user = null;

                    if (res.status === 404) {
                        vm.message = 'No such user';
                    } else {
                        vm.message = 'Error';
                    }
                });
        };

        vm.saveUser = function (id) {
            if (id) {
                crudService.update('users', vm.user)
                    .then(function () {
                        Notification.success('User updated');
                        $state.go('users');
                    })
                    .catch(function () {
                        $window.scrollTo(0, 0);
                        Notification.error('Fail');
                    });
            } else {
                crudService.add('users', vm.user)
                    .then(function () {
                        Notification.success('User added');
                        $state.go('users');
                    })
                    .catch(function () {
                        $window.scrollTo(0, 0);
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

})();
