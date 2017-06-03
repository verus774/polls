(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('mainController', mainController);

    mainController.$inject = ['crudService', 'roomsService', 'ioService', 'startFromFilter', '$filter'];

    function mainController(crudService, roomsService, ioService, startFromFilter, $filter) {
        var vm = this;
        var $translate = $filter('translate');

        vm.currentPage = 1;
        vm.pageSize = 10;

        var loadRooms = function () {
            crudService.getAll('rooms')
                .then(function (rooms) {
                    vm.rooms = rooms;
                })
                .catch(function (res) {
                    vm.rooms = null;

                    if (res.status === 404) {
                        vm.message = $translate('NO_ROOMS');
                    } else {
                        vm.message = $translate('ERROR');
                    }
                });
        };

        vm.joinRoom = function (id, name) {
            ioService.emit('joinRoom', id);
            roomsService.setCurrentRoom({_id: id, name: name});
        };

        loadRooms();
    }

})();
