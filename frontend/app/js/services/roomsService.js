(function () {
    'use strict';

    angular
        .module('pollsApp')
        .factory('roomsService', roomsService);

    roomsService.$inject = ['storageService', 'authService', '$state'];

    function roomsService(storageService, authService, $state) {
        var getCurrentRoom = function () {
            return authService.getUser();
        };

        var getCurrentRoomUrl = function () {
            return $state.href('roomsDetail', {id: getCurrentRoom()._id}, {absolute: true})
        };

        return {
            getCurrentRoom: getCurrentRoom,
            getCurrentRoomUrl: getCurrentRoomUrl
        };
    }

})();
