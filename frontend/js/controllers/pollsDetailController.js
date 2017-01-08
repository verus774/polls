angular
    .module('pollsApp')
    .controller('pollsDetailController', pollsDetailController);

pollsDetailController.$inject = ['crudService', '$stateParams'];

function pollsDetailController(crudService, $stateParams) {
    var vm = this;

    crudService.get('polls', $stateParams.id)
        .then(function (poll) {
            vm.poll = poll;
        });

}
