angular
    .module('pollsApp')
    .controller('usersController', usersController);

usersController.$inject = ['crudService', 'modalService', 'Notification', '$window', '$state'];

function usersController(crudService, modalService, Notification, $window, $state) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    var loadUsers = function () {
        crudService.getAll('users')
            .then(function (users) {
                vm.users = users;
            })
            .catch(function (res) {
                if (res.status === 403) {
                    $state.go('polls');
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
