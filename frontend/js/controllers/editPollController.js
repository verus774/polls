angular
    .module('pollsApp')
    .controller('editPollController', editPollController);

editPollController.$inject = ['pollsService', '$state', 'poll'];

function editPollController(pollsService, $state, poll) {
    var vm = this;
    vm.poll = poll;

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

}
