(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('resultsController', resultsController);

    resultsController.$inject = ['crudService', 'modalService', 'Notification', '$window', 'startFromFilter', '$filter'];

    function resultsController(crudService, modalService, Notification, $window, startFromFilter, $filter) {
        var vm = this;
        var $translate = $filter('translate');

        vm.currentPage = 1;
        vm.pageSize = 10;

        var loadResults = function () {
            crudService.getAll('results')
                .then(function (results) {
                    vm.results = results;
                })
                .catch(function (res) {
                    vm.results = null;

                    if (res.status === 404) {
                        vm.message = $translate('NO_RESULTS');
                    } else {
                        vm.message = $translate('ERROR');
                    }
                });
        };

        vm.removeResult = function (id) {
            var modalOptions = {
                closeButtonText: $translate('DELETE_RESULT_MODAL_CLOSE_BUTTON_TEXT'),
                actionButtonText: $translate('DELETE_RESULT_MODAL_ACTION_BUTTON_TEXT'),
                headerText: $translate('DELETE_RESULT_MODAL_HEADER_TEXT'),
                bodyText: $translate('DELETE_RESULT_MODAL_BODY_TEXT')
            };

            modalService.show(modalOptions).then(function () {
                crudService.remove('results', id)
                    .then(function () {
                        Notification.success($translate('RESULT_DELETED'));
                        loadResults();
                    })
                    .catch(function () {
                        Notification.error($translate('ERROR'));
                    });
                $window.scrollTo(0, 0);
            });
        };

        loadResults();
    }

})();
