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
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var add = function (poll) {
        var deferred = $q.defer();

        $http.post(config.apiEndpoint + '/polls', poll)
            .success(function (response) {
                deferred.resolve(response.data);
            })
            .error(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var remove = function (id) {
        var deferred = $q.defer();

        $http.delete(config.apiEndpoint + '/polls/' + id)
            .success(function (response) {
                deferred.resolve(response.data);
            })
            .error(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    return {
        getAll: getAll,
        add: add,
        remove: remove
    };
}
