(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('pollsController', pollsController);

    pollsController.$inject = ['storageService', 'authService', 'crudService', 'ioService', '$filter', 'chartsService', '$window', 'modalService', 'Notification', 'startFromFilter'];

    function pollsController(storageService, authService, crudService, ioService, $filter, chartsService, $window, modalService, Notification, startFromFilter) {
        var vm = this;
        var $translate = $filter('translate');

        vm.currentPage = 1;
        vm.pageSize = 10;

        vm.answers = [];
        vm.categories = [];
        var chartPrefix = 'chart_';

        ioService.emit('joinRoom', authService.getUser()._id);

        function loadPolls() {
            crudService.getAll('polls')
                .then(function (polls) {
                    angular.forEach(polls, function (poll) {
                        vm.categories.push(poll.category);
                    });

                    vm.polls = polls;
                    vm.activePoll = $filter('filter')(polls, {active: true})[0];

                    if (vm.activePoll) {
                        initCharts(vm.activePoll.questions);
                    }
                })
                .catch(function (res) {
                    vm.polls = null;

                    if (res.status === 404) {
                        vm.message = $translate('NO_POLLS');
                    } else {
                        vm.message = $translate('ERROR');
                    }
                });
        }

        loadPolls();

        function groupAnswers(answers) {
            var groupedAnswers = [];

            angular.forEach($filter('groupBy')(answers, 'id'), function (value, key) {
                angular.forEach($filter('countBy')(value, 'answer'), function (value2, key2) {
                    groupedAnswers.push({question: key, answer: key2, count: value2});
                });
            });

            return groupedAnswers;
        }

        function initCharts(questions) {
            angular.forEach(questions, function (question) {
                var chart = chartPrefix + question._id;
                vm[chart] = chartsService.init(question);
            });
        }

        function clearCharts(questions) {
            angular.forEach(questions, function (question) {
                chartsService.clear(vm[chartPrefix + question._id]);
            });
        }

        function fillCharts(answers) {
            vm.results = [];

            angular.forEach(answers, function (answer) {
                var chart = chartPrefix + answer.question;
                var answerText;
                var questionText;
                var questionId;

                angular.forEach(vm.activePoll.questions, function (question) {
                    if (answer.question === question._id) {
                        answerText = question.choices[answer.answer];
                        questionText = question.text;
                        questionId = question._id
                    }
                });

                vm.results.push({
                    questionId: questionId,
                    questionText: questionText,
                    answer: answerText,
                    count: answer.count
                });

                chartsService.draw(vm[chart], answerText, answer.count);
            });

        }

        vm.removePoll = function (id) {
            var modalOptions = {
                closeButtonText: $translate('DELETE_POLL_MODAL_CLOSE_BUTTON_TEXT'),
                actionButtonText: $translate('DELETE_POLL_MODAL_ACTION_BUTTON_TEXT'),
                headerText: $translate('DELETE_POLL_MODAL_HEADER_TEXT'),
                bodyText: $translate('DELETE_POLL_MODAL_BODY_TEXT')
            };

            modalService.show(modalOptions).then(function () {
                crudService.remove('polls', id)
                    .then(function () {
                        Notification.success($translate('POLL_DELETED'));
                        loadPolls();
                    })
                    .catch(function () {
                        Notification.error($translate('ERROR'));
                    });
                $window.scrollTo(0, 0);
            });
        };

        vm.startPoll = function (id) {
            var token = storageService.get('access_token');
            if (token) {
                ioService.emit('startPoll', {access_token: token, id: id});
            }
        };

        vm.stopPoll = function (id) {
            var token = storageService.get('access_token');
            if (token) {
                ioService.emit('stopPoll', {access_token: token, id: id});
            }
        };

        vm.saveResults = function () {
            var modalOptions = {
                closeButtonText: $translate('SAVE_RESULT_MODAL_CLOSE_BUTTON_TEXT'),
                actionButtonText: $translate('SAVE_RESULT_MODAL_ACTION_BUTTON_TEXT'),
                headerText: $translate('SAVE_RESULT_MODAL_HEADER_TEXT'),
                bodyText: $translate('SAVE_RESULT_MODAL_BODY_TEXT')
            };

            var result = {
                poll: vm.activePoll._id,
                results: vm.results
            };

            modalService.show(modalOptions).then(function () {
                crudService.add('results', result)
                    .then(function () {
                        vm.stopPoll(vm.activePoll._id);
                        Notification.success($translate('RESULT_ADDED'));
                    })
                    .catch(function () {
                        Notification.error($translate('ERROR'));
                    });
                $window.scrollTo(0, 0);
            });

        };

        ioService.on('answers', function (data) {
            angular.forEach(data.answers, function (value) {
                vm.answers.push(value);
            });

            clearCharts(vm.activePoll.questions);
            fillCharts(groupAnswers(vm.answers));
        });

        ioService.on('startPoll', function (data) {
            vm.activePoll = data;

            if (vm.activePoll) {
                initCharts(vm.activePoll.questions);
            }

            angular.forEach(vm.polls, function (poll) {
                if (vm.activePoll._id === poll._id) {
                    poll.active = true;
                }
            });

        });

        ioService.on('stopPoll', function (data) {
            angular.forEach(vm.polls, function (poll) {
                if (data._id === poll._id) {
                    poll.active = false;
                }
            });
            vm.activePoll = null;
        });

        ioService.on('error', function () {
            Notification.error($translate('ERROR'));
        });

    }

})();
