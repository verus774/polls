angular
    .module('pollsApp')
    .controller('signupController', signupController);

signupController.$inject = ['$state', 'authService'];

function signupController($state, authService) {
    var vm = this;

    vm.signup = function () {
        authService.signup(vm.username, vm.name, vm.password)
            .then(function () {
                $state.go('polls');
            })
            .catch(function () {
                vm.signupFail = true;
            });

    }
}
