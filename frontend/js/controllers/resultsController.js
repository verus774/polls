angular
    .module('pollsApp')
    .controller('resultsController', resultsController);

resultsController.$inject = ['resultsService', 'modalService', 'alertService', '$window'];

function resultsController(resultsService, modalService, alertService, $window) {
    var vm = this;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    var loadResults = function () {
        resultsService.getAll()
            .then(function (results) {
                vm.results = results;
            });
    };

    vm.removeResult = function (id) {
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Delete result',
            headerText: 'Delete result?',
            bodyText: 'Are you sure you want to delete this result?'
        };

        modalService.show(modalOptions).then(function () {
            resultsService.remove(id)
                .then(function () {
                    loadResults();
                    alertService.add('success', 'Result deleted', alertTimeout);
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
                });
            $window.scrollTo(0, 0);
        });
    };

    loadResults();
}
