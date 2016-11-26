angular
    .module('pollsApp')
    .controller('mainController', mainController);

mainController.$inject = ['roomsService', '$rootScope', 'ioService'];

function mainController(roomsService, $rootScope, ioService) {
    var vm = this;

    vm.currentPage = 1;
    vm.pageSize = 10;

    var loadRooms = function () {
        roomsService.getAll()
            .then(function (rooms) {
                vm.rooms = rooms;
            });
    };

    vm.joinRoom = function (id, name) {
        ioService.emit('joinRoom', id);
        $rootScope.currentRoom = {_id: id, name: name};
    };

    loadRooms();
}
