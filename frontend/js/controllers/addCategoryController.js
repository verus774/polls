angular
    .module('pollsApp')
    .controller('addCategoryController', addCategoryController);

addCategoryController.$inject = ['categoriesService', '$stateParams', '$window', '$state', 'Notification'];

function addCategoryController(categoriesService, $stateParams, $window, $state, Notification) {
    var vm = this;

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
                    .then(function () {
                        Notification.success('Category updated');
                        $state.go('categories');
                    })
                    .catch(function () {
                        Notification.error('Fail');
                    });
            } else {
                categoriesService.add(vm.category)
                    .then(function () {
                        vm.category = {};
                        vm.addCategoryForm.$setPristine();
                        Notification.success('Category added');
                        $state.go('categories');
                    })
                    .catch(function () {
                        Notification.error('Fail');
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
