angular
    .module('pollsApp')
    .controller('addCategoryController', addCategoryController);

addCategoryController.$inject = ['categoriesService', '$stateParams', '$window', 'alertService'];

function addCategoryController(categoriesService, $stateParams, $window, alertService) {
    var vm = this;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    var loadCategory = function (id) {
        categoriesService.get(id)
            .then(function (category) {
                vm.category = category;
                vm.orig = angular.copy(vm.category);
            });
    };

    vm.saveCategory = function (id) {
        if (vm.category) {
            if (id) {
                categoriesService.update(id, vm.category)
                    .then(function (updatedCategory) {
                        vm.category = updatedCategory;
                        alertService.add('success', 'Category updated', alertTimeout);
                    })
                    .catch(function () {
                        alertService.add('danger', 'Fail', alertTimeout);
                    });
            } else {
                categoriesService.add(vm.category)
                    .then(function () {
                        vm.category = {};
                        vm.addCategoryForm.$setPristine();
                        alertService.add('success', 'Category added', alertTimeout);
                    })
                    .catch(function () {
                        alertService.add('danger', 'Fail', alertTimeout);
                    });
            }
            $window.scrollTo(0, 0);
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
