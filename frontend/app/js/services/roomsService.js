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

        var getCurrentRoomUrl = function () {
            return window.location.origin + '/rooms/' + getCurrentRoom()._id;
        };

        return {
            setCurrentRoom: setCurrentRoom,
            getCurrentRoom: getCurrentRoom,
            getCurrentRoomUrl: getCurrentRoomUrl
        };
    }

})();
