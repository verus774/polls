angular
    .module('pollsApp')
    .controller('resultDetailController', resultDetailController);

resultDetailController.$inject = ['resultsService', '$stateParams', '$filter'];

function resultDetailController(resultsService, $stateParams, $filter) {
    var vm = this;

    var chartPrefix = 'chart_';

    var loadResult = function (id) {
        resultsService.get(id)
            .then(function (result) {
                vm.result = result;
                initCharts(vm.result.results);
            });
    };

    function initCharts(results) {
        angular.forEach($filter('groupBy')(results, 'questionId'), function (value, key) {
            var chart = chartPrefix + key;
            vm[chart] = {};
            vm[chart].type = 'PieChart';

            vm[chart].data = {
                'cols': [
                    {label: 'Var', type: 'string'},
                    {label: 'Count', type: 'number'}
                ], 'rows': []
            };

            angular.forEach(vm.result.results, function (res) {
                if (res.questionId == key) {
                    vm[chart].options = {
                        title: res.questionText,
                        legend: {position: 'left'}
                    };

                    vm[chart].data.rows.push({
                        c: [
                            {v: res.answer},
                            {v: res.count}
                        ]
                    });
                }

            });

        });
    }

    if ($stateParams.id) {
        loadResult($stateParams.id);
    }
}