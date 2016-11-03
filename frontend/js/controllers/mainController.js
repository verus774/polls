angular
    .module('pollsApp')
    .controller('mainController', mainController);

mainController.$inject = ['rooms'];

function mainController(rooms) {
    var vm = this;
    vm.rooms = rooms;
}
