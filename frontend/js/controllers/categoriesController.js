angular
    .module('pollsApp')
    .controller('categoriesController', categoriesController);

categoriesController.$inject = ['categoriesService', 'modalService', 'Notification', '$window'];

function categoriesController(categoriesService, modalService, Notification, $window) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

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
