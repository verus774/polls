(function () {
    'use strict';

    angular
        .module('pollsApp')
        .factory('roomsService', roomsService);

    roomsService.$inject = ['storageService'];

    function roomsService(storageService) {
        var setCurrentRoom = function (room) {
            storageService.set('currentRoom', JSON.stringify(room));
        };

        var getCurrentRoom = function () {
            return JSON.parse(storageService.get('currentRoom'));
        };

        return {
            setCurrentRoom: setCurrentRoom,
            getCurrentRoom: getCurrentRoom
        };
    }

})();
