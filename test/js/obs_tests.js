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

        var obs = new OBS('/base/test/data/Open_Bible_Stories.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded catalog data.');
            expect(obs.languages.length).toBeGreaterThan(0);
            expect(obs.languages[0].resources[0].identifier).toEqual('obs');

            done();
        });
    });

    it('Test OBS.buildDiv()', function(done) {

        var obs = new OBS('/base/test/data/Open_Bible_Stories.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded catalog data.');

            obs.buildDiv();

            var html = $('body');

            console.log(html);

            done();
        });
    });

    it('Test no format specified', function(done) {

        var obs = new OBS('/base/test/data/Open_Bible_Stories.json', function() {

            var english = obs.languages.filter(function(lang) { return lang.language === 'en'; });
            // noinspection JSCheckFunctionSignatures
            expect(english.length).toEqual(1);

            var resources = OBS.getResources(english[0]);

            expect(resources).toHaveProp('other');
            expect(resources.other.length).toBeGreaterThan(0);

            done();
        });
    });

    it('Test YouTube format', function(done) {

        var obs = new OBS('/base/test/data/Open_Bible_Stories.json', function() {

            var english = obs.languages.filter(function(lang) { return lang.language === 'en'; });
            var resources = OBS.getResources(english[0]);
            expect(resources.other.length).toBeGreaterThan(0);

            var youtube = resources.other.filter(function(res) { return res['format'].indexOf('youtube') > -1});
            expect(youtube.length).toBeGreaterThan(0);

            done();
        });
    });

    it('Test YouTube link', function(done) {

        var obs = new OBS('/base/test/data/Open_Bible_Stories.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded catalog data.');

            obs.buildDiv();

            var html = $('body');

            console.log(html);

            done();
        });
    });

    it('Test audio chapters', function(done) {

        var obs = new OBS('/base/test/data/Open_Bible_Stories.json', function() {

            var english = obs.languages.filter(function(lang) { return lang.language === 'en'; });
            var resources = OBS.getResources(english[0]);
            expect(resources.audio.length).toBeGreaterThan(0);

            var mp3 = resources.audio[0];
            expect(mp3).toHaveProp('chapters');
            expect(mp3.chapters[0].identifier).toEqual('01');

            done();
        });
    });

    it('Test DOCX, ODT and EPUB link', function(done) {

        var obs = new OBS('/base/test/data/Open_Bible_Stories.json', function(loadResult) {

            expect(loadResult).toEqual('Successfully loaded catalog data.');

            obs.buildDiv();

            var $div = $('body').find('h2[data-lang-code=en]').closest('div');
            var html = $div.html();

            expect(html).toContain('Word Document');
            expect(html).toContain('OpenDocument Text');
            expect(html).toContain('ePub Book');

            html = $('html').html();
            done();
        });
    });
});
