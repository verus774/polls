angular
    .module('pollsApp')
    .controller('manageController', manageController);

manageController.$inject = ['pollsService', '$state', 'ioService', '$filter', 'chartsService'];

function manageController(pollsService, $state, ioService, $filter, chartsService) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    vm.answers = [];
    var chartPrefix = 'chart_';

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
        angular.forEach(answers, function (answer) {
            var chart = chartPrefix + answer.question;
            var answerText;

            angular.forEach(vm.activePoll.questions, function (question) {
                if (answer.question === question._id) {
                    answerText = question.choices[answer.answer];
                }
            });

            chartsService.draw(vm[chart], answerText, answer.count);
        });

    }

    vm.removePoll = function (id) {
        pollsService.remove(id)
            .then(function () {
                $state.reload();
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

    ioService.on('answers', function (data) {
        angular.forEach(data.answers, function (value) {
            vm.answers.push(value);
        });

        clearCharts(vm.activePoll.questions);
        fillCharts(groupAnswers(vm.answers));
    });

    loadPolls();
}
