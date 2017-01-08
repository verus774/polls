(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('resultsController', resultsController);

    resultsController.$inject = ['crudService', 'modalService', 'Notification', '$window'];

    function resultsController(crudService, modalService, Notification, $window) {
        var vm = this;

        vm.currentPage = 1;
        vm.pageSize = 10;

        var loadResults = function () {
            crudService.getAll('results')
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
                crudService.remove('results', id)
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

})();
