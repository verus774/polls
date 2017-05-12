(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('categoriesController', categoriesController);

    categoriesController.$inject = ['crudService', 'modalService', 'Notification', '$window', 'startFromFilter'];

    function categoriesController(crudService, modalService, Notification, $window, startFromFilter) {
        var vm = this;

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
                        vm.message = 'No categories';
                    } else {
                        vm.message = 'Error';
                    }
                });
        };

        vm.removeCategory = function (id) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete',
                headerText: 'Delete category?',
                bodyText: 'Are you sure you want to delete this category?'
            };

            modalService.show(modalOptions).then(function () {
                crudService.remove('categories', id)
                    .then(function () {
                        Notification.success('Category deleted');
                        loadCategories();
                    })
                    .catch(function () {
                        Notification.error('Fail');
                    });
                $window.scrollTo(0, 0);
            });
        };

        loadCategories();
    }

})();