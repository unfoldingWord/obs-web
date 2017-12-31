'use strict';

describe('Strings test suite', function() {

    it('Test getHostName', function() {

        var host_name = 'http://www.somehost.com';
        expect(host_name.getHostName()).toEqual('www.somehost.com');

        host_name = 'https://bloomlibrary.org/browse/detail/lL1eyazU7L';
        expect(host_name.getHostName()).toEqual('bloomlibrary.org');
    });
});
