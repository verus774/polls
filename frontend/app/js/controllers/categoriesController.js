(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('categoriesController', categoriesController);

    categoriesController.$inject = ['crudService', 'modalService', 'Notification', '$window', 'startFromFilter', '$filter'];

    function categoriesController(crudService, modalService, Notification, $window, startFromFilter, $filter) {
        var vm = this;
        var $translate = $filter('translate');

        vm.currentPage = 1;
        vm.pageSize = 10;

        var loadCategories = function () {
            crudService.getAll('categories')
                .then(function (categories) {
                    vm.categories = categories;
                })
                .catch(function (res) {
                    vm.categories = null;

                    if (res.status === 404) {
                        vm.message = $translate('NO_CATEGORIES');
                    } else {
                        vm.message = $translate('ERROR');
                    }
                });
        };

        vm.removeCategory = function (id) {
            var modalOptions = {
                closeButtonText: $translate('DELETE_CATEGORY_MODAL_CLOSE_BUTTON_TEXT'),
                actionButtonText: $translate('DELETE_CATEGORY_MODAL_ACTION_BUTTON_TEXT'),
                headerText: $translate('DELETE_CATEGORY_MODAL_HEADER_TEXT'),
                bodyText: $translate('DELETE_CATEGORY_MODAL_BODY_TEXT')
            };

            modalService.show(modalOptions).then(function () {
                crudService.remove('categories', id)
                    .then(function () {
                        Notification.success($translate('CATEGORY_DELETED'));
                        loadCategories();
                    })
                    .catch(function () {
                        Notification.error($translate('ERROR'));
                    });
                $window.scrollTo(0, 0);
            });
        };

        loadCategories();
    }

})();
