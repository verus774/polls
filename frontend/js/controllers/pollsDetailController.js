(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('pollsDetailController', pollsDetailController);

    pollsDetailController.$inject = ['crudService', '$stateParams'];

    function pollsDetailController(crudService, $stateParams) {
        var vm = this;

        crudService.get('polls', $stateParams.id)
            .then(function (poll) {
                vm.poll = poll;
            })
            .catch(function (res) {
                vm.poll = null;

                if (res.status === 404) {
                    vm.message = 'No such poll';
                } else {
                    vm.message = 'Error';
                }
            });

    }

})();
