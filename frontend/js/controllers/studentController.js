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
                vm.activePoll = activePoll;
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

    loadActivePoll();
}
