angular
    .module('pollsApp')
    .controller('studentController', studentController);

studentController.$inject = ['ioService', 'crudService', '$state', 'roomsService'];

function studentController(ioService, crudService, $state, roomsService) {
    var vm = this;

    vm.currentRoom = roomsService.getCurrentRoom();

    var loadActivePoll = function () {
        crudService.getAll('active-poll', {room: vm.currentRoom._id})
            .then(function (activePoll) {
                vm.activePoll = activePoll;
            })
            .catch(function (res) {
                vm.activePoll = null;

                if (res.status === 404) {
                    vm.message = 'No active poll';
                } else {
                    vm.message = 'Error';
                }
            });
    };

    ioService.on('startPoll', function (data) {
        vm.activePoll = data;
    });

    ioService.on('stopPoll', function () {
        vm.activePoll = null;
    });

    vm.submitAnswers = function () {
        var answers = {
            answers: []
        };

        angular.forEach(vm.activePoll.questions, function (question) {
            answers.answers.push({id: question._id, answer: question.answer});
        });

        ioService.emit('answers', answers);

        answers = null;
        vm.activePoll = null;
        vm.message = 'Answers submitted';
    };

    vm.leaveRoom = function () {
        ioService.emit('leaveRoom', vm.currentRoom._id);
        $state.go('main');
    };

    loadActivePoll();
}