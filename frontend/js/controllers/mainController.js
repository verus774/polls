angular
    .module('pollsApp')
    .controller('mainController', mainController);

mainController.$inject = ['roomsService', '$rootScope'];

function mainController(roomsService, $rootScope) {
    var vm = this;

    var loadRooms = function () {
        roomsService.getAll()
            .then(function (rooms) {
                vm.rooms = rooms;
            });
    };

    vm.joinRoom = function (id, name) {
        $rootScope.curRoom = {_id: id, name: name};
    };

    loadRooms();
}
