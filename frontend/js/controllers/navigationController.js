angular
    .module('pollsApp')
    .controller('navigationController', navigationController);

navigationController.$inject = ['$location', 'authService'];

function navigationController($location, authService) {
    var vm = this;

    vm.authService = authService;

    vm.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    vm.logout = function () {
        authService.logout();
        $location.path('/');
    }
}
