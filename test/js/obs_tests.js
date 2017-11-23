'use strict';

describe('OBS class test suite', function() {

    beforeEach(function () {

        jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

        loadFixtures('published-languages-fixture.html');

        // verify the fixture loaded successfully
        expect(jQuery('#jasmine-fixtures')).toBeTruthy();
    });

    it('Test OBS constructor', function() {

        var obs = new OBS('test');

        expect(obs).toBeTruthy();
        expect(obs.testString).toEqual('Test success.');
    });

    it('Test constructor with bad path', function(done) {

        new OBS('/base/test/data/catalog.bob', function(loadResult) {

            expect(loadResult).toEqual('Failed: status = "error", message = "Not Found".');

            done();
        });
    });

    it('Test constructor with good path', function(done) {

        var obs = new OBS('/base/test/data/catalog.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded catalog data.');
            expect(obs.languages.length).toBeGreaterThan(0);
            expect(obs.languages[0].obs_resource.identifier).toEqual('obs');

            done();
        });
    });

    it('Test OBS.buildDiv()', function(done) {

        var obs = new OBS('/base/test/data/catalog.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded catalog data.');

            obs.buildDiv();

            var html = $('body');

            console.log(html);

            done();
        });
    });
});
