angular
    .module('pollsApp')
    .controller('manageController', manageController);

manageController.$inject = ['pollsService', 'ioService', '$filter', 'chartsService', 'alertService', '$window', 'modalService', 'resultsService'];

function manageController(pollsService, ioService, $filter, chartsService, alertService, $window, modalService, resultsService) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    vm.answers = [];
    var chartPrefix = 'chart_';

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    function loadPolls() {
        pollsService.getAll()
            .then(function (polls) {
                vm.polls = polls;
                vm.activePoll = $filter('filter')(polls, {active: true})[0];

                if (vm.activePoll) {
                    initCharts(vm.activePoll.questions);
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
            actionButtonText: 'Delete poll',
            headerText: 'Delete poll?',
            bodyText: 'Are you sure you want to delete this poll?'
        };

        modalService.show(modalOptions).then(function () {
            pollsService.remove(id)
                .then(function () {
                    loadPolls();
                    alertService.add('success', 'Poll deleted', alertTimeout);
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
                });
            $window.scrollTo(0, 0);
        });
    };

    vm.startPoll = function (id) {
        ioService.emit('startPoll', {id: id});
        loadPolls();
    };

    vm.stopPoll = function (id) {
        ioService.emit('stopPoll', {id: id});
        vm.activePoll = null;
        loadPolls();
    };

    vm.saveResults = function () {
        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Save result',
            headerText: 'Save result?',
            bodyText: 'Are you sure you want to stop poll and save result?'
        };

        var result = {
            title: vm.activePoll.title,
            results: vm.results
        };

        modalService.show(modalOptions).then(function () {
            resultsService.add(result)
                .then(function () {
                    vm.stopPoll(vm.activePoll._id);
                    alertService.add('success', 'Result added', alertTimeout);
                })
                .catch(function () {
                    alertService.add('danger', 'Fail', alertTimeout);
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

}
