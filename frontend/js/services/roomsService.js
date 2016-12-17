angular
    .module('pollsApp')
    .factory('roomsService', roomsService);

roomsService.$inject = ['$http', '$q', 'config', 'storageService'];

function roomsService($http, $q, config, storageService) {
    var getAll = function() {
        var deferred = $q.defer();

        $http.get(config.apiEndpoint + '/rooms')
            .then(function (response) {
                deferred.resolve(response.data.data);
            })
            .catch(function (response) {
                deferred.reject(response);
            });

        return deferred.promise;
    };

    var setCurrentRoom = function (room) {
        storageService.set('currentRoom', JSON.stringify(room));
    };

    var getCurrentRoom = function () {
        return JSON.parse(storageService.get('currentRoom'));
    };

    return {
        getAll: getAll,
        setCurrentRoom: setCurrentRoom,
        getCurrentRoom: getCurrentRoom
    };
}
