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
                vm.orig = angular.copy(vm.poll);
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
        vm.addPollForm.$setDirty();
    };

    vm.removeQuestion = function (questionIndex) {
        vm.poll.questions.splice(questionIndex, 1);
        vm.addPollForm.$setDirty();
    };

    vm.removeChoice = function (questionIndex, choiceIndex) {
        vm.poll.questions[questionIndex].choices.splice(choiceIndex, 1);
        vm.addPollForm.$setDirty();
    };

    vm.addChoice = function (index) {
        vm.poll.questions[index].choices.push('');
        vm.addPollForm.$setDirty();
    };

    vm.resetForm = function () {
        if (vm.poll._id) {
            vm.poll = angular.copy(vm.orig);
            vm.addPollForm.$setPristine();
        } else {
            $state.reload();
        }
    };

    if ($stateParams.id) {
        loadPoll($stateParams.id);
    }

}
