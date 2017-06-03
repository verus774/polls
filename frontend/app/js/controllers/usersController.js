(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('usersController', usersController);

    usersController.$inject = ['crudService', 'modalService', 'Notification', '$window', '$state', 'startFromFilter', '$filter'];

    function usersController(crudService, modalService, Notification, $window, $state, startFromFilter, $filter) {
        var vm = this;
        var $translate = $filter('translate');

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
                        vm.message = $translate('ERROR');
                    }
                });
        };

        vm.removeUser = function (id) {
            var modalOptions = {
                closeButtonText: $translate('DELETE_USER_MODAL_CLOSE_BUTTON_TEXT'),
                actionButtonText: $translate('DELETE_USER_MODAL_ACTION_BUTTON_TEXT'),
                headerText: $translate('DELETE_USER_MODAL_HEADER_TEXT'),
                bodyText: $translate('DELETE_USER_MODAL_BODY_TEXT')
            };

            modalService.show(modalOptions).then(function () {
                crudService.remove('users', id)
                    .then(function () {
                        Notification.error($translate('USER_DELETED'));
                        loadUsers();
                    })
                    .catch(function () {
                        Notification.error($translate('ERROR'));
                    });
                $window.scrollTo(0, 0);
            });
        };

        loadUsers();
    }

})();
