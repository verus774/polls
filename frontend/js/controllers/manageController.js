angular
    .module('pollsApp')
    .controller('manageController', manageController);

manageController.$inject = ['pollsService', 'polls', '$state'];

function manageController(pollsService, polls, $state) {
    var vm = this;
    vm.polls = polls;

    vm.removePoll = function (id) {
        pollsService.remove(id)
            .then(function () {
                $state.reload();
            });
    };
}
