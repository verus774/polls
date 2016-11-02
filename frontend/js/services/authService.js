angular
    .module('pollsApp')
    .factory('authService', authService);

authService.$inject = ['$http', '$q', 'config', 'storageService'];

function authService($http, $q, config, storageService) {
    var login = function (username, password) {
        var deferred = $q.defer();
        var user = {
            username: username,
            password: password
        };

        $http.post(config.authEndpoint + '/login', user)
            .success(function (response) {
                var token = response.data.token;

                if (token) {
                    storageService.set('access_token', token);
                    deferred.resolve();
                } else {
                    storageService.remove('access_token');
                    deferred.reject('No access token in server response');
                }
            })
            .error(function (response) {
                storageService.remove('access_token');
                deferred.reject(response.message);
            });

        return deferred.promise;
    };

    var logout = function() {
        storageService.remove('access_token');
    };

    return {
        login: login,
        logout: logout
    }
}
