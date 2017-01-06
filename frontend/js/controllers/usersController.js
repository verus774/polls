angular
    .module('pollsApp')
    .controller('usersController', usersController);

usersController.$inject = ['usersService', 'modalService', 'alertService', '$window', '$state'];

function usersController(usersService, modalService, alertService, $window, $state) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    var loadUsers = function () {
        usersService.getAll()
            .then(function (users) {
                vm.users = users;
            })
            .catch(function (res) {
                if (res.status === 403) {
                    $state.go('manage');
                }
                else if (res.status === 404) {
                    vm.users = null;
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
            usersService.remove(id)
                .then(function () {
                    loadUsers();
                    alertService.add('success', 'User deleted', alertTimeout);
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
                });
            $window.scrollTo(0, 0);
        });
    };

    loadUsers();
}
