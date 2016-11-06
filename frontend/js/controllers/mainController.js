angular
    .module('pollsApp')
    .controller('mainController', mainController);

mainController.$inject = ['roomsService'];

function mainController(roomsService) {
    var vm = this;

    var loadRooms = function () {
        roomsService.getAll()
            .then(function (rooms) {
                vm.rooms = rooms;
            });
    };

    loadRooms();

}
