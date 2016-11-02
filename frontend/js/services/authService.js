angular
    .module('pollsApp')
    .factory('authService', authService);

authService.$inject = ['$http', '$q', 'config', 'storageService', 'jwtHelper'];

function authService($http, $q, config, storageService, jwtHelper) {
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

    var logout = function () {
        storageService.remove('access_token');
    };

    var isLoggedIn = function () {
        var token = storageService.get('access_token');
        return !!(token && !jwtHelper.isTokenExpired(token));
    };

    return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn
    }
}
