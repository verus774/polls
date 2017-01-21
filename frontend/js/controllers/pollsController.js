(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('pollsController', pollsController);

    pollsController.$inject = ['authService', 'crudService', 'ioService', '$filter', 'chartsService', '$window', 'modalService', 'Notification'];

    function pollsController(authService, crudService, ioService, $filter, chartsService, $window, modalService, Notification) {
        var vm = this;

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
                        vm.message = 'No polls';
                    } else {
                        vm.message = 'Error';
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
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete',
                headerText: 'Delete poll?',
                bodyText: 'Are you sure you want to delete this poll and the related results?'
            };

            modalService.show(modalOptions).then(function () {
                crudService.remove('polls', id)
                    .then(function () {
                        Notification.success('Poll deleted');
                        loadPolls();
                    })
                    .catch(function () {
                        Notification.error('Fail');
                    });
                $window.scrollTo(0, 0);
            });
        };

        vm.startPoll = function (id) {
            ioService.emit('startPoll', {id: id});
        };

        vm.stopPoll = function (id) {
            ioService.emit('stopPoll', {id: id});
        };

        vm.saveResults = function () {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Save result',
                headerText: 'Save result?',
                bodyText: 'Are you sure you want to stop poll and save result?'
            };

            var result = {
                poll: vm.activePoll._id,
                title: vm.activePoll.title,
                results: vm.results
            };

            modalService.show(modalOptions).then(function () {
                crudService.add('results', result)
                    .then(function () {
                        vm.stopPoll(vm.activePoll._id);
                        Notification.success('Result added');
                    })
                    .catch(function () {
                        Notification.error('Fail');
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
                if (vm.activePoll._id == poll._id) {
                    poll.active = true;
                }
            });

        });

        ioService.on('stopPoll', function (data) {
            angular.forEach(vm.polls, function (poll) {
                if (data._id == poll._id) {
                    poll.active = false;
                }
            });
            vm.activePoll = null;
        });

    }

})();
