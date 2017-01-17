(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('addPollController', addPollController);

    addPollController.$inject = ['pollsService', '$stateParams', '$window', '$state', 'Notification', 'crudService'];

    function addPollController(pollsService, $stateParams, $window, $state, Notification, crudService) {
        var vm = this;

        vm.poll = pollsService.getEmpty();

        var loadPoll = function (id) {
            crudService.get('polls', id)
                .then(function (poll) {
                    vm.poll = poll;
                    vm.orig = angular.copy(vm.poll);
                })
                .catch(function (res) {
                    vm.poll = null;

                    if (res.status === 404) {
                        vm.message = 'No such poll';
                    } else {
                        vm.message = 'Error';
                    }
                });
        };

        var loadCategories = function () {
            crudService.getAll('categories')
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
                    crudService.update('polls', vm.poll)
                        .then(function () {
                            Notification.success('Poll updated');
                            $state.go('polls');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error('Fail');
                        });
                } else {
                    crudService.add('polls', vm.poll)
                        .then(function () {
                            Notification.success('Poll added');
                            $state.go('polls');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error('Fail');
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
                vm.poll = pollsService.getEmpty();
                vm.addPollForm.$setPristine();
            }
        };

        loadCategories();

        if ($stateParams.id) {
            loadPoll($stateParams.id);
        }

    }

})();
