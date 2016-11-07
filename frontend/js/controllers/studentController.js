angular
    .module('pollsApp')
    .controller('studentController', studentController);

studentController.$inject = ['ioService', 'pollsService', '$rootScope'];

function studentController(ioService, pollsService, $rootScope) {
    var vm = this;

    vm.curRoom = $rootScope.curRoom;

    var loadActivePoll = function () {
        pollsService.getActive()
            .then(function (activePoll) {
                vm.activePoll = activePoll[0];
            })
            .catch(function (res) {
                if (res === 404) {
                    vm.message = 'No active polls';
                }
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
