angular
    .module('pollsApp')
    .controller('pollsDetailController', pollsDetailController);

pollsDetailController.$inject = ['pollsService', '$stateParams'];

function pollsDetailController(pollsService, $stateParams) {
    var vm = this;

    pollsService.get($stateParams.id)
        .then(function (poll) {
            vm.poll = poll;
        });

}
