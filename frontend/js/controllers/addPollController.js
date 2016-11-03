angular
    .module('pollsApp')
    .controller('addPollController', addPollController);

addPollController.$inject = ['pollsService', '$state'];

function addPollController(pollsService, $state) {
    var vm = this;

    vm.poll = {
        title: '',
        questions: [
            {text: '', choices: ['', '']}
        ]
    };

    vm.savePoll = function () {
        if (vm.poll) {
            pollsService.add(vm.poll)
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
