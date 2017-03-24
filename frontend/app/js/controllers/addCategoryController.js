(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('addCategoryController', addCategoryController);

    addCategoryController.$inject = ['crudService', '$stateParams', '$window', '$state', 'Notification'];

    function addCategoryController(crudService, $stateParams, $window, $state, Notification) {
        var vm = this;

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
                        vm.message = 'No such category';
                    } else {
                        vm.message = 'Error';
                    }
                });
        };

        vm.saveCategory = function (id) {
            if (vm.category) {
                if (id) {
                    crudService.update('categories', vm.category)
                        .then(function () {
                            Notification.success('Category updated');
                            $state.go('categories');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error('Fail');
                        });
                } else {
                    crudService.add('categories', vm.category)
                        .then(function () {
                            Notification.success('Category added');
                            $state.go('categories');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error('Fail');
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
