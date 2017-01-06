angular
    .module('pollsApp')
    .controller('categoriesController', categoriesController);

categoriesController.$inject = ['categoriesService', 'modalService', 'alertService', '$window'];

function categoriesController(categoriesService, modalService, alertService, $window) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    var loadCategories = function () {
        categoriesService.getAll()
            .then(function (categories) {
                vm.categories = categories;
            })
            .catch(function () {
                vm.categories = null;
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
            categoriesService.remove(id)
                .then(function () {
                    loadCategories();
                    alertService.add('success', 'Category deleted', alertTimeout);
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
                });
            $window.scrollTo(0, 0);
        });
    };

    loadCategories();
}
