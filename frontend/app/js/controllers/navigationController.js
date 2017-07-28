(function () {
    'use strict';

    angular
        .module('pollsApp')
        .controller('navigationController', navigationController);

    navigationController.$inject = ['$state', 'authService', '$translate'];

    function navigationController($state, authService, $translate) {
        var vm = this;

        vm.authService = authService;
        vm.selectedLanguage = $translate.proposedLanguage();

        vm.logout = function () {
            authService.logout();
            $state.go('main');
        };

        vm.changeLanguage = function (selectedLanguage) {
            vm.selectedLanguage = selectedLanguage;
            $translate.use(selectedLanguage);
        };
    }

})();
