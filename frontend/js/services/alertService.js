angular
    .module('pollsApp')
    .factory('alertService', alertService);

alertService.$inject = ['$timeout'];

function alertService($timeout) {
    var alerts = [];

    var add = function (type, msg, timeout) {
        var alert = {
            type: 'alert-' + type,
            msg: msg,
            close: function () {
                return closeAlert(this);
            }
        };

        if (parseInt(timeout)) {
            $timeout(closeAlert, timeout, true, alert);
        }
        return alerts.push(alert);
    };

    function closeAlert(alert) {
        return alerts.splice(alerts.indexOf(alert), 1);
    }

    var get = function () {
        return alerts;
    };

    var clear = function () {
        alerts.length = 0;
    };

    return {
        add: add,
        get: get,
        clear: clear
    };
}
