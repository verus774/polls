angular
    .module('pollsApp')
    .controller('editPollController', editPollController);

editPollController.$inject = ['pollsService', '$state', '$stateParams'];

function editPollController(pollsService, $state, $stateParams) {
    var vm = this;

    var loadPoll = function () {
        pollsService.get($stateParams.id)
            .then(function (poll) {
                vm.poll = poll;
            });
    };

    vm.savePoll = function () {
        if (vm.poll) {
            pollsService.update(vm.poll._id, vm.poll)
                .then(function () {
                    $state.go('manage');
                });
        }
    };

    vm.addQuestion = function () {
        vm.poll.questions.push({text: '', choices: ['', '']});
    };

    vm.removeChoice = function (questionIndex, choiceIndex) {
        vm.poll.questions[questionIndex].choices.splice(choiceIndex, 1);
    };

    vm.addChoice = function (index) {
        vm.poll.questions[index].choices.push('');
    };

    loadPoll();

}
