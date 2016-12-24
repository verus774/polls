angular
    .module('pollsApp')
    .factory('resultsService', resultsService);

resultsService.$inject = ['$http', '$q', 'config'];

function resultsService($http, $q, config) {

    var getAll = function () {
        var deferred = $q.defer();

        $http.get(config.apiEndpoint + '/results')
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var get = function (id) {
        var deferred = $q.defer();

        $http.get(config.apiEndpoint + '/results/' + id)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var add = function (result) {
        var deferred = $q.defer();

        $http.post(config.apiEndpoint + '/results', result)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var remove = function (id) {
        var deferred = $q.defer();

        $http.delete(config.apiEndpoint + '/results/' + id)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var update = function (id, poll) {

    };

    return {
        getAll: getAll,
        get: get,
        add: add,
        remove: remove,
        update: update
    };
}
