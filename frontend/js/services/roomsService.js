angular
    .module('pollsApp')
    .factory('roomsService', roomsService);

roomsService.$inject = ['$http', '$q', 'config'];

function roomsService($http, $q, config) {

    var getAll = function() {
        var deferred = $q.defer();

        $http.get(config.apiEndpoint + '/rooms').success(function (response) {
            deferred.resolve(response.data);
        });

        return deferred.promise;
    };


    return {
        getAll : getAll
    };
}
