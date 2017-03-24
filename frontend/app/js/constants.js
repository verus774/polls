angular.module('pollsApp')
    .constant('config', {
        storageType: 'localStorage',
        apiEndpoint: 'api/v1',
        authEndpoint: 'auth'
    })
    .constant('USER_ROLES', {
        admin: 'admin',
        user: 'user'
    });
