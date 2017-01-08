(function () {
    'use strict';

    angular
        .module('pollsApp')
        .factory('chartsService', chartsService);

    chartsService.$inject = [];

    function chartsService() {

        var init = function (question) {
            var chart = {};
            chart.type = 'PieChart';

            chart.options = {
                title: question.text,
                legend: {position: 'left'}
            };

            chart.data = {
                'cols': [
                    {label: 'Var', type: 'string'},
                    {label: 'Count', type: 'number'}
                ], 'rows': []
            };

            return chart;
        };

        var clear = function (chartObj) {
            chartObj.data.rows = [];
        };

        var draw = function (chartObj, answerText, answerCount) {
            chartObj.data.rows.push({
                c: [
                    {v: answerText},
                    {v: answerCount}
                ]
            })
        };

        return {
            init: init,
            clear: clear,
            draw: draw
        };
    }

})();
