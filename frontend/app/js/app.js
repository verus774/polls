angular.module('pollsApp', [
    'ui.router',
    'angular-jwt',
    'angular.filter',
    'btford.socket-io',
    'googlechart',
    'angular-loading-bar',
    'ui.bootstrap',
    'ui-notification',
    'pascalprecht.translate'
]);

angular.module('pollsApp').config(function ($httpProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    $httpProvider.interceptors.push('interceptorService');
});

angular.module('pollsApp').config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('ru_RU');
});

angular.module('pollsApp').run(function ($rootScope, authService, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.data && toState.data.restricted && !authService.isLoggedIn()) {
            event.preventDefault();
            $state.go('login');
        }
    });

});
