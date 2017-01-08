(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('mainController', mainController);

    mainController.$inject = ['crudService', 'roomsService', 'ioService'];

    function mainController(crudService, roomsService, ioService) {
        var vm = this;

        vm.currentPage = 1;
        vm.pageSize = 10;

        var loadRooms = function () {
            crudService.getAll('rooms')
                .then(function (rooms) {
                    vm.rooms = rooms;
                })
                .catch(function () {
                    vm.rooms = null;
                });
        };

        vm.joinRoom = function (id, name) {
            ioService.emit('joinRoom', id);
            roomsService.setCurrentRoom({_id: id, name: name});
        };

        loadRooms();
    }

})();
