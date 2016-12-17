angular
    .module('pollsApp')
    .factory('modalService', modalService);

modalService.$inject = ['$uibModal'];

function modalService($uibModal) {

    var modalDefaults = {
        templateUrl: '../templates/modal.html',
        controllerAs: 'vm'
    };

    var show = function (modalOptions) {
        modalDefaults.controller = function ($uibModalInstance) {
            var vm = this;

            vm.modalOptions = modalOptions;

            vm.modalOptions.ok = function () {
                $uibModalInstance.close();
            };

            vm.modalOptions.close = function () {
                $uibModalInstance.dismiss();
            };
        };

        var tempModalOptions = {};
        angular.extend(tempModalOptions, modalDefaults, modalOptions);

        return $uibModal.open(tempModalOptions).result;
    };

    return {
        show: show
    };
}
