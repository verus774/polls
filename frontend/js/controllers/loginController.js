angular
    .module('pollsApp')
    .controller('loginController', loginController);

loginController.$inject = ['$location', 'authService'];

function loginController($location, authService) {
    var vm = this;

    vm.login = function () {
        authService.login(vm.username, vm.password)
            .then(function () {
                $location.path('/manage');
            })
            .catch(function (message) {
                console.log(message);
            });
    };
}
