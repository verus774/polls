angular
    .module('pollsApp')
    .factory('usersService', usersService);

usersService.$inject = ['$http', '$q', 'config'];

function usersService($http, $q, config) {
    var update = function (user) {
        var deferred = $q.defer();

        $http.put(config.apiEndpoint + '/users', user)
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    return {
        update: update
    }
}
