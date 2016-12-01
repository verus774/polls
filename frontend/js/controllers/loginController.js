angular
    .module('pollsApp')
    .controller('loginController', loginController);

loginController.$inject = ['$state', 'authService', 'alertService'];

function loginController($state, authService, alertService) {
    var vm = this;

    vm.alerts = alertService.get();
    alertService.clear();

    vm.login = function () {
        authService.login(vm.username, vm.password)
            .then(function () {
                $state.go('manage');
            })
            .catch(function () {
                alertService.add('danger', 'Authorization fail');
            });
    };

}
