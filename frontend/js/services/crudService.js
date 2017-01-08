angular
    .module('pollsApp')
    .factory('crudService', crudService);

crudService.$inject = ['$http', '$q', 'config'];

function crudService($http, $q, config) {
    var apiEndpoint = config.apiEndpoint + '/';

    var getAll = function (collectionName, query) {
        var deferred = $q.defer();

        var queryString = query || '';

        $http.get(apiEndpoint + collectionName + queryString)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var get = function (collectionName, id) {
        var deferred = $q.defer();

        $http.get(apiEndpoint + collectionName + '/' + id)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var add = function (collectionName, item) {
        var deferred = $q.defer();

        $http.post(apiEndpoint + collectionName, item)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var remove = function (collectionName, id) {
        var deferred = $q.defer();

        $http.delete(apiEndpoint + collectionName + '/' + id)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var update = function (collectionName, item) {
        var deferred = $q.defer();

        $http.put(apiEndpoint + collectionName + '/' + item._id, item)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    return {
        getAll: getAll,
        get: get,
        add: add,
        remove: remove,
        update: update
    };
}
