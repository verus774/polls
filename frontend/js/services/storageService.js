angular
    .module('pollsApp')
    .factory('storageService', storageService);

storageService.$inject = ['$window', 'config'];

function storageService($window, config) {
    var storageType = config.storageType;

    var get = function(key) {
        return $window[storageType].getItem(key);
    };

    var set = function(key, value) {
        $window[storageType].setItem(key, value);
    };

    var remove = function(key) {
        $window[storageType].removeItem(key);
    };

    return {
        set : set,
        get : get,
        remove : remove
    }
}
