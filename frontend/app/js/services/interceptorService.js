(function () {
    'use strict';

    angular
        .module('pollsApp')
        .factory('interceptorService', interceptorService);

    interceptorService.$inject = ['storageService'];

    function interceptorService(storageService) {

        var request = function (config) {
            var token = storageService.get('access_token');

            if (token) {
                config.headers.Authorization = token;
            }

            return config;
        };

        return {
            request: request
        };
    }

})();
