angular
    .module('pollsApp')
    .controller('roomsDetailController', roomsDetailController);

roomsDetailController.$inject = ['ioService', 'crudService', '$state', '$stateParams', 'roomsService', '$filter'];

function roomsDetailController(ioService, crudService, $state, $stateParams, roomsService, $filter) {
    var vm = this;
    var $translate = $filter('translate');

    vm.currentRoom = {};
    vm.currentRoom._id = $stateParams.id;

    ioService.emit('joinRoom', vm.currentRoom._id);

    var loadActivePoll = function () {
        crudService.getAll('active-poll', {room: vm.currentRoom._id})
            .then(function (activePoll) {
                vm.activePoll = activePoll;
            })
            .catch(function (res) {
                vm.activePoll = null;

                if (res.status === 404) {
                    vm.message = $translate('NO_ACTIVE_POLL');
                } else {
                    vm.message = $translate('ERROR');
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
        vm.message = $translate('ANSWERS_SUBMITTED');
    };

    vm.leaveRoom = function () {
        ioService.emit('leaveRoom', vm.currentRoom._id);
        $state.go('main');
    };

    loadActivePoll();
}
