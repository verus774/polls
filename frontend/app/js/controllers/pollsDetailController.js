(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('pollsDetailController', pollsDetailController);

    pollsDetailController.$inject = ['crudService', '$stateParams', '$filter'];

    function pollsDetailController(crudService, $stateParams, $filter) {
        var vm = this;
        var $translate = $filter('translate');

        crudService.get('polls', $stateParams.id)
            .then(function (poll) {
                vm.poll = poll;
            })
            .catch(function (res) {
                vm.poll = null;

                if (res.status === 404) {
                    vm.message = $translate('NO_SUCH_POLL');
                } else {
                    vm.message = $translate('ERROR');
                }
            });

    }

})();
