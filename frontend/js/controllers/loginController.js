angular
    .module('pollsApp')
    .controller('loginController', loginController);

loginController.$inject = ['$state', 'authService'];

function loginController($state, authService) {
    var vm = this;

    vm.login = function () {
        authService.login(vm.username, vm.password)
            .then(function () {
                $state.go('manage');
            })
            .catch(function () {
                vm.authFail = true;
            });
    };
}
