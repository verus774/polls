(function () {
    'use strict';

    angular
        .module('pollsApp')
        .directive('backButton', backButton);

    backButton.$inject = ['$window'];

    function backButton($window) {
        function link(scope, element, attrs) {
            element.bind('click', function () {
                $window.history.back();
            });
        }

        return {
            link: link,
            restrict: 'A'
        };

    }

})();
