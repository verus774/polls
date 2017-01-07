angular
    .module('pollsApp')
    .controller('addPollController', addPollController);

addPollController.$inject = ['pollsService', '$stateParams', '$window', 'alertService', 'categoriesService'];

function addPollController(pollsService, $stateParams, $window, alertService, categoriesService) {
    var vm = this;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    vm.poll = pollsService.getEmpty();

    var loadPoll = function (id) {
        pollsService.get(id)
            .then(function (poll) {
                vm.poll = poll;
                vm.orig = angular.copy(vm.poll);
            });
    };

    var loadCategories = function () {
        categoriesService.getAll()
            .then(function (categories) {
                vm.categories = categories;
                vm.poll.category = vm.categories[0];
            })
            .catch(function () {
                vm.categories = null;
            });
    };

    vm.closeAlert = function () {
        vm.alert = null;
    };

    vm.savePoll = function (id) {
        if (vm.poll) {
            if (id) {
                pollsService.update(id, vm.poll)
                    .then(function (updatedPoll) {
                        vm.poll = updatedPoll;
                        alertService.add('success', 'Poll updated', alertTimeout);
                    })
                    .catch(function () {
                        alertService.add('danger', 'Fail', alertTimeout);
                    });
            } else {
                pollsService.add(vm.poll)
                    .then(function () {
                        vm.poll = pollsService.getEmpty();
                        vm.addPollForm.$setPristine();
                        alertService.add('success', 'Poll added', alertTimeout);
                    })
                    .catch(function () {
                        alertService.add('danger', 'Fail', alertTimeout);
                    });
            }
            $window.scrollTo(0, 0);
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
            vm.poll = pollsService.getEmpty();
            vm.addPollForm.$setPristine();
        }
    };

    loadCategories();

    if ($stateParams.id) {
        loadPoll($stateParams.id);
    }

}
