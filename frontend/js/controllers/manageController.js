angular
    .module('pollsApp')
    .controller('manageController', manageController);

manageController.$inject = ['pollsService', '$state', 'ioService', '$filter'];

function manageController(pollsService, $state, ioService, $filter) {
    var vm = this;

    vm.answers = [];

    var loadPolls = function () {
        pollsService.getAll()
            .then(function (polls) {
                vm.polls = polls;
                vm.activePoll = $filter('filter')(polls, {active: true})[0];
            });
    };

    vm.removePoll = function (id) {
        pollsService.remove(id)
            .then(function () {
                $state.reload();
            });
    };

    vm.startPoll = function (id) {
        ioService.emit('startPoll', {id: id});
    };

    vm.stopPoll = function (id) {
        ioService.emit('stopPoll', {id: id});
        vm.activePoll = null;
    };

    ioService.on('startPoll', function () {
        loadPolls();
    });

    ioService.on('stopPoll', function () {
        loadPolls();
    });

    ioService.on('answers', function (data) {
        console.log(data);
    });

    loadPolls();
}
