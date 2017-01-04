angular
    .module('pollsApp')
    .filter('startFrom', startFromFilter);

function startFromFilter() {
    return function (input, start) {
        if (!input || !input.length) {
            return;
        }
        start = parseInt(start, 10);
        return input.slice(start);
    }
}
