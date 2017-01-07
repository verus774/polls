angular
    .module('pollsApp')
    .factory('authService', authService);

authService.$inject = ['$http', '$q', 'config', 'storageService', 'jwtHelper', 'USER_ROLES'];

function authService($http, $q, config, storageService, jwtHelper, USER_ROLES) {
    var login = function (username, password) {
        var deferred = $q.defer();
        var user = {
            username: username,
            password: password
        };

        $http.post(config.authEndpoint + '/login', user)
            .then(function (response) {
                var token = response.data.data.token;

                if (token) {
                    storageService.set('access_token', token);
                    deferred.resolve();
                } else {
                    storageService.remove('access_token');
                    deferred.reject('No access token in server response');
                }
            })
            .catch(function (response) {
                storageService.remove('access_token');
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var logout = function () {
        storageService.remove('access_token');
    };

    var isLoggedIn = function () {
        var token = storageService.get('access_token');
        return (token && !jwtHelper.isTokenExpired(token));
    };

    var signup = function (username, name, password) {
        var deferred = $q.defer();

        var user = {
            username: username,
            name: name,
            password: password
        };

        $http.post(config.authEndpoint + '/signup', user)
            .then(function (response) {
                var token = response.data.data.token;

                if (token) {
                    storageService.set('access_token', token);
                    deferred.resolve();
                } else {
                    storageService.remove('access_token');
                    deferred.reject('No access token in server response');
                }
            })
            .catch(function (response) {
                storageService.remove('access_token');
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var getUser = function () {
        if (isLoggedIn()) {
            var token = storageService.get('access_token');
            return jwtHelper.decodeToken(token);
        }
    };

    var updateMe = function (user) {
        var deferred = $q.defer();

        $http.put(config.authEndpoint + '/me', user)
            .then(function (response) {
                var token = response.data.data.token;

                if (token) {
                    storageService.set('access_token', token);
                    deferred.resolve();
                } else {
                    storageService.remove('access_token');
                    deferred.reject('No access token in server response');
                }
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var isAdmin = function () {
        var token = storageService.get('access_token');
        return token && !jwtHelper.isTokenExpired(token) && jwtHelper.decodeToken(token).role === USER_ROLES.admin;
    };

    return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        signup: signup,
        getUser: getUser,
        updateMe: updateMe,
        isAdmin: isAdmin
    }
}
