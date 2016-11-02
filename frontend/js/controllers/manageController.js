angular
    .module('pollsApp')
    .controller('manageController', manageController);

manageController.$inject = ['pollsService'];

function manageController(pollsService) {
    var vm = this;

    pollsService.getAll()
        .then(function (polls) {
            vm.polls = polls;
        })
        .catch(function (message) {
            console.log(message);
        });
}
