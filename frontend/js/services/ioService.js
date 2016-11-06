angular
    .module('pollsApp')
    .factory('ioService', ioService);

ioService.$inject = ['socketFactory'];

function ioService(socketFactory) {
    return socketFactory();
}
