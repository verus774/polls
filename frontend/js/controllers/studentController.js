angular
    .module('pollsApp')
    .controller('studentController', studentController);

studentController.$inject = ['ioService', 'pollsService'];

function studentController(ioService, pollsService) {
    var vm = this;

    var loadActivePoll = function () {
        pollsService.getActive()
            .then(function (activePoll) {
                vm.activePoll = activePoll[0];
            });
    };

    ioService.on('startPoll', function (data) {
        vm.activePoll = data;
    });

    ioService.on('stopPoll', function () {
        vm.activePoll = null;
    });

    loadActivePoll();

}
