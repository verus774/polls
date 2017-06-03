(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('addCategoryController', addCategoryController);

    addCategoryController.$inject = ['crudService', '$stateParams', '$window', '$state', 'Notification', '$filter'];

    function addCategoryController(crudService, $stateParams, $window, $state, Notification, $filter) {
        var vm = this;
        var $translate = $filter('translate');
        vm.category = {};

        var loadCategory = function (id) {
            crudService.get('categories', id)
                .then(function (category) {
                    vm.category = category;
                    vm.orig = angular.copy(vm.category);
                })
                .catch(function (res) {
                    vm.category = null;

                    if (res.status === 404) {
                        vm.message = $translate('NO_SUCH_CATEGORY');
                    } else {
                        vm.message = $translate('ERROR');
                    }
                });
        };

        vm.saveCategory = function (id) {
            if (vm.category) {
                if (id) {
                    crudService.update('categories', vm.category)
                        .then(function () {
                            Notification.success($translate('CATEGORY_UPDATED'));
                            $state.go('categories');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error($translate('ERROR'));
                        });
                } else {
                    crudService.add('categories', vm.category)
                        .then(function () {
                            Notification.success($translate('CATEGORY_ADDED'));
                            $state.go('categories');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error($translate('ERROR'));
                        });
                }
            }
        };

        vm.resetForm = function () {
            if (vm.category._id) {
                vm.category = angular.copy(vm.orig);
            } else {
                vm.category = {};
            }

            vm.addCategoryForm.$setPristine();
        };

        if ($stateParams.id) {
            loadCategory($stateParams.id);
        }

    }

})();
