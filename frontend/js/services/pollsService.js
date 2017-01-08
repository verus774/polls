angular
    .module('pollsApp')
    .factory('pollsService', pollsService);

pollsService.$inject = [];

function pollsService() {

    var getEmpty = function () {
        return angular.copy({
            title: '',
            category: '',
            questions: [
                {text: '', choices: ['', '']}
            ]
        });
    };

    return {
        getEmpty: getEmpty
    };
}
