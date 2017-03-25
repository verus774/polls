(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('usersController', usersController);

    usersController.$inject = ['crudService', 'modalService', 'Notification', '$window', '$state', 'startFromFilter'];

    function usersController(crudService, modalService, Notification, $window, $state, startFromFilter) {
        var vm = this;

        vm.currentPage = 1;
        vm.pageSize = 10;

        var loadUsers = function () {
            crudService.getAll('users')
                .then(function (users) {
                    vm.users = users;
                })
                .catch(function (res) {
                    vm.users = null;

                    if (res.status === 403) {
                        $state.go('polls');
                    } else {
                        vm.message = 'Error';
                    }
                });
        };

        vm.removeUser = function (id) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete',
                headerText: 'Delete user?',
                bodyText: 'Are you sure you want to delete this user and the related objects?'
            };

            modalService.show(modalOptions).then(function () {
                crudService.remove('users', id)
                    .then(function () {
                        Notification.success('User deleted');
                        loadUsers();
                    })
                    .catch(function () {
                        Notification.error('Fail');
                    });
                $window.scrollTo(0, 0);
            });
        };

        loadUsers();
    }

})();
