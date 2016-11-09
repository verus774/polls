angular
    .module('pollsApp')
    .controller('manageController', manageController);

manageController.$inject = ['pollsService', '$state', 'ioService', '$filter'];

function manageController(pollsService, $state, ioService, $filter) {
    var vm = this;

    vm.answers = [];
    var chartPrefix = 'chart_';
    var chartType = 'PieChart';

    function loadPolls() {
        pollsService.getAll()
            .then(function (polls) {
                vm.polls = polls;
                vm.activePoll = $filter('filter')(polls, {active: true})[0];

                if (vm.activePoll) {
                    initCharts(vm.activePoll.questions, chartType);
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

    function initCharts(questions, chartType) {
        angular.forEach(questions, function (question) {
            var chart = chartPrefix + question._id;

            vm[chart] = {};
            vm[chart].type = chartType || 'PieChart';

            vm[chart].options = {
                title: question.text,
                legend: {position: 'left'}
            };

            vm[chart].data = {
                'cols': [
                    {label: 'Var', type: 'string'},
                    {label: 'Count', type: 'number'}
                ], 'rows': []
            };
        });
    }

    function clearCharts(questions) {
        angular.forEach(questions, function (question) {
            vm[chartPrefix + question._id].data.rows = [];
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

            vm[chart].data.rows.push({
                c: [
                    {v: answerText},
                    {v: answer.count}
                ]
            });
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
