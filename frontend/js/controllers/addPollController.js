angular
    .module('pollsApp')
    .controller('addPollController', addPollController);

addPollController.$inject = ['pollsService', '$state', '$stateParams'];

function addPollController(pollsService, $state, $stateParams) {
    var vm = this;

    vm.poll = {
        title: '',
        questions: [
            {text: '', choices: ['', '']}
        ]
    };

    var loadPoll = function (id) {
        pollsService.get(id)
            .then(function (poll) {
                vm.poll = poll;
            });
    };

    vm.savePoll = function (id) {
        if (vm.poll) {
            if (id) {
                pollsService.update(id, vm.poll)
                    .then(function () {
                        $state.go('manage');
                    });
            } else {
                pollsService.add(vm.poll)
                    .then(function () {
                        $state.go('manage');
                    });
            }
        }
    };

    vm.addQuestion = function () {
        vm.poll.questions.push({text: '', choices: ['', '']});
    };

    vm.removeQuestion = function (questionIndex) {
        vm.poll.questions.splice(questionIndex, 1);
    };

    vm.removeChoice = function (questionIndex, choiceIndex) {
        vm.poll.questions[questionIndex].choices.splice(choiceIndex, 1);
    };

    vm.addChoice = function (index) {
        vm.poll.questions[index].choices.push('');
    };

    if ($stateParams.id) {
        loadPoll($stateParams.id);
    }

}
