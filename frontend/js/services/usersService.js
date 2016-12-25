angular
    .module('pollsApp')
    .factory('usersService', usersService);

usersService.$inject = ['$http', '$q', 'config'];

function usersService($http, $q, config) {
    var getAll = function () {
        var deferred = $q.defer();

        $http.get(config.apiEndpoint + '/users')
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

        $http.get(config.apiEndpoint + '/users/' + id)
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

        $http.delete(config.apiEndpoint + '/users/' + id)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var add = function (user) {
        var deferred = $q.defer();

        $http.post(config.apiEndpoint + '/users', user)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var update = function (id, user) {
        var deferred = $q.defer();

        $http.put(config.apiEndpoint + '/users/' + id, user)
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
        remove: remove,
        add: add,
        update: update
    };
}
