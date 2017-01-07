angular
    .module('pollsApp')
    .controller('resultsController', resultsController);

resultsController.$inject = ['resultsService', 'modalService', 'Notification', '$window'];

function resultsController(resultsService, modalService, Notification, $window) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    var loadResults = function () {
        resultsService.getAll()
            .then(function (results) {
                vm.results = results;
            })
            .catch(function () {
                vm.results = null;
            });
    };

    vm.removeResult = function (id) {
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Delete',
            headerText: 'Delete result?',
            bodyText: 'Are you sure you want to delete this result?'
        };

        modalService.show(modalOptions).then(function () {
            resultsService.remove(id)
                .then(function () {
                    Notification.success('Result deleted');
                    loadResults();
                })
                .catch(function () {
                    Notification.error('Fail');
                });
            $window.scrollTo(0, 0);
        });
    };

    loadResults();
}
