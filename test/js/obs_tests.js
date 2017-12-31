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

    it('Test no format specified', function(done) {

        var obs = new OBS('/base/test/data/catalog.json', function() {

            var english = obs.languages.filter(function(lang) { return lang.identifier === 'en'; });
            // noinspection JSCheckFunctionSignatures
            expect(english.length).toEqual(1);

            var resources = OBS.getResources(english[0]);

            expect(resources).toHaveProp('other');
            expect(resources.other.length).toBeGreaterThan(0);

            done();
        });
    });

    it('Test YouTube format', function(done) {

        var obs = new OBS('/base/test/data/catalog.json', function() {

            var english = obs.languages.filter(function(lang) { return lang.identifier === 'en'; });
            var resources = OBS.getResources(english[0]);
            expect(resources.other.length).toBeGreaterThan(0);

            var youtube = resources.other.filter(function(res) { return res['format'].indexOf('youtube') > -1});
            expect(youtube.length).toBeGreaterThan(0);

            done();
        });
    });

    it('Test YouTube link', function(done) {

        var obs = new OBS('/base/test/data/catalog.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded catalog data.');

            obs.buildDiv();

            var html = $('body');

            console.log(html);

            done();
        });
    });
});
