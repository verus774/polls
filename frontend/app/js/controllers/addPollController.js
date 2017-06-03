(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('addPollController', addPollController);

    addPollController.$inject = ['pollsService', '$stateParams', '$window', '$state', 'Notification', 'crudService', '$filter'];

    function addPollController(pollsService, $stateParams, $window, $state, Notification, crudService, $filter) {
        var vm = this;
        var $translate = $filter('translate');
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
                        vm.message = $translate('NO_SUCH_POLL');
                    } else {
                        vm.message = $translate('ERROR');
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
                            Notification.success($translate('POLL_UPDATED'));
                            $state.go('polls');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error($translate('ERROR'));
                        });
                } else {
                    crudService.add('polls', vm.poll)
                        .then(function () {
                            Notification.success($translate('POLL_ADDED'));
                            $state.go('polls');
                        })
                        .catch(function () {
                            $window.scrollTo(0, 0);
                            Notification.error($translate('ERROR'));
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
