angular
    .module('pollsApp')
    .controller('navigationController', navigationController);

navigationController.$inject = ['$location'];

function navigationController($location) {
    var vm = this;

    vm.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}
