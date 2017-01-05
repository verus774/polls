angular
    .module('pollsApp')
    .controller('loginController', loginController);

loginController.$inject = ['$state', 'authService', 'alertService'];

function loginController($state, authService, alertService) {
    var vm = this;

    var alertTimeout = 3000;
    vm.alerts = alertService.get();
    alertService.clear();

    vm.login = function () {
        authService.login(vm.username, vm.password)
            .then(function () {
                $state.go('polls');
            })
            .catch(function () {
                alertService.clear();
                alertService.add('danger', 'Authorization fail', alertTimeout);
                vm.username = null;
                vm.password = null;
                vm.loginForm.$setPristine();
            });
    };

}
