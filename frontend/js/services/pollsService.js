angular
    .module('pollsApp')
    .factory('pollsService', pollsService);

pollsService.$inject = ['$http', '$q', 'config'];

function pollsService($http, $q, config) {

    var getAll = function () {
        var deferred = $q.defer();

        $http.get(config.apiEndpoint + '/polls')
            .success(function (response) {
                deferred.resolve(response.data);
            })
            .error(function (response) {
                deferred.reject(response.message);
            });

        return deferred.promise;
    };

    return {
        getAll: getAll
    };
}
