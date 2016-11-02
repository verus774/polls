angular
    .module('pollsApp')
    .factory('roomsService', roomsService);

roomsService.$inject = ['$http', '$q'];

function roomsService($http, $q) {

    var getAll = function() {
        var deferred = $q.defer();

        $http.get('/api/v1/rooms').success(function(response) {
            deferred.resolve(response.data);
        });

        return deferred.promise;
    };

    return {
        getAll : getAll
    };
}
