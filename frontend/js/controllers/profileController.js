angular
    .module('pollsApp')
    .controller('profileController', profileController);

profileController.$inject = ['authService'];

function profileController(authService) {
    var vm = this;
    vm.user = authService.getUser();
}
