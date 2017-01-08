(function () {
    'use strict';

    angular
        .module('pollsApp')
        .factory('interceptorService', interceptorService);

    interceptorService.$inject = ['$location', '$q', 'storageService'];

    function interceptorService($location, $q, storageService) {

        var request = function (config) {
            var token = storageService.get('access_token');

            if (token) {
                config.headers.Authorization = token;
            }

            return config;
        };

        var response = function (response) {
            if (response.status === 401 || response.status === 403) {
                $location.path('/login');
            }

            return $q.when(response);
        };

        return {
            request: request,
            response: response
        };
    }

})();
